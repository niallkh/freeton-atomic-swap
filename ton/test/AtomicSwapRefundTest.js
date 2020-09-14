/* eslint-env mocha */
const expect = require('chai').expect
const getGramsFromGiver = require('./giver.js')
const AtomicSwapWalletContract = require('../contracts/AtomicSwapWalletContract.js')
const AtomicSwapContract = require('../contracts/AtomicSwapContract.js')
const { TONClient } = require('ton-client-node-js')

describe('Atomic Swap Refund', function () {
    this.timeout(5000)

    let client
    let secretHash
    let secret
    let amount

    let initiatorContract
    let initiatorKeyPair

    let participantContract
    let participantKeyPair

    let atomicSwapContract

    before(async () => {
        client = await TONClient.create({servers: ['http://0.0.0.0']})

        initiatorKeyPair = await client.crypto.ed25519Keypair()
        participantKeyPair = await client.crypto.ed25519Keypair()

        secret = await client.crypto.randomGenerateBytes(32)

        const codeAtomicSwap = await client.contracts.getCodeFromImage({
            imageBase64: AtomicSwapContract.package.imageBase64
        })

        const constructorParams = { '_codeAtomicSwap': codeAtomicSwap.codeBase64 }

        // Deploy Initiator Wallet
        {
            const address = await getFutureAddress(
                client, AtomicSwapWalletContract.package, initiatorKeyPair, constructorParams
            )
            await getGramsFromGiver(client, address, 100_000_000_000)
            initiatorContract = new AtomicSwapWalletContract(client, address, initiatorKeyPair)
            await initiatorContract.deploy(constructorParams)
            await client.queries.accounts.waitFor({
                id: { eq: address },
                acc_type_name: { eq: 'Active' }
            }, 'id')
        }

        // Deploy Participant Wallet
        {
            const address = await getFutureAddress(
                client, AtomicSwapWalletContract.package, participantKeyPair, constructorParams
            )
            await getGramsFromGiver(client, address, 1_000_000_000)
            participantContract = new AtomicSwapWalletContract(client, address, participantKeyPair)
            await participantContract.deploy(constructorParams)
            await client.queries.accounts.waitFor({
                id: { eq: address },
                acc_type_name: { eq: 'Active' }
            }, 'id')
        }

        secretHash = (await initiatorContract.hashSecretLocal({
            secret: secret, 
        }))['value0']

        amount = 10_000_000_000 // 10 ton
    })

    it('create Atomic Swap', async () => {

        // Create Atomic Swap
        const data = await client.contracts.getDeployData({
            abi: AtomicSwapContract.package.abi,
            initParams: {
                secretHash: `${secretHash}`,
            },
            publicKeyHex: '0000000000000000000000000000000000000000000000000000000000000000'
        })
        
        const result = await initiatorContract.createSwap({
            'initiator': initiatorContract.address, 
            'participant': participantContract.address, 
            'amount': 10_000_000_000,
            'timeLock': parseInt(Date.now() / 1000) + 2,
            'data': data.dataBase64
        })

        // Return address of Atomic Swap
        const atomicSwapAddress = result['value0']
        expect(atomicSwapAddress).to.be.not.equal(undefined)
        atomicSwapContract = new AtomicSwapContract(client, atomicSwapAddress)

        // Check that participant accepted transfer
        const messages = (await client.queries.messages.query({
                src: { eq: participantContract.address },
                msg_type: { eq: 2 },
            }, "body"
        ))

        const events = await Promise.all(messages.map(async msg => await client.contracts.decodeOutputMessageBody({
            abi: AtomicSwapWalletContract.package.abi,
            bodyBase64: msg['body'],
            internal: false,
        })))

        const onInitiateEvent = events.find(event => event.function == "TransferAccepted")    
        expect(htoa(onInitiateEvent.output.payload)).to.be.equal("Atomic Swap")     
    })


    it('wait until Atomic Swap expired', async function() {
        this.timeout(3_500)
        await delay(3_000)
    })

    it('check params of Atomic Swap', async () => {

        const params = await atomicSwapContract.paramsLocal()

        // check params of Atomic Swap, should be expired
        expect(parseInt(params['_amount'], 16), 'amount').to.be.equal(amount)
        expect(parseInt(params['_balance'], 16), 'balance gt').to.be.gt(amount)
        expect(parseInt(params['_timeLock'], 16), 'expired time').to.be.lt(parseInt(Date.now() / 1000))
        expect(params['_initiator'], 'initiator').to.be.equal(`${initiatorContract.address}`)
        expect(params['_participant'], 'participant').to.be.equal(`${participantContract.address}`)
        expect(params['_secretHash'], 'secret hash').to.be.equal(`${secretHash}`)
    })

    it('refund by initiator', async () => {

        // refund Atomic Swap
        const runBody = await client.contracts.createRunBody({
            abi: AtomicSwapContract.package.abi,
            function: "refund",
            params: {},
            internal: true,
        })

        const params = { 
            dest: atomicSwapContract.address,
            value: 10_000_000, // fee
            bounce: true,
            flag: 1,
            payload: runBody.bodyBase64
        }
        await initiatorContract.sendTransaction(params)

        // check that balance of initiator as before with the exception of fees
        const initiatorBalance = (await client.queries.accounts.query({
                id: { eq: initiatorContract.address },
            }, "balance"
        ))[0]['balance']

        expect(parseInt(initiatorBalance, 16)).to.be.gt(99_999_000_000)
    })

    after(async () => {
        await client.close()
    })
})

async function getFutureAddress(client, package, keyPair, constructorParams = {}) {
    return (await client.contracts.createDeployMessage({
        package,
        constructorParams,
        keyPair,
    })).address
}

function htoa(hex) {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16)); 
    }
    return str;
}

async function delay(time) {
    return new Promise(res => {
        setTimeout(function() {
            res()
        }, time);
    })
}

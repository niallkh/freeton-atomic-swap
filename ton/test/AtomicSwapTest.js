/* eslint-env mocha */
const expect = require('chai').expect
const getGramsFromGiver = require('./giver.js')
const AtomicSwapWalletContract = require('../contracts/AtomicSwapWalletContract.js')
const AtomicSwapContract = require('../contracts/AtomicSwapContract.js')
const { TONClient } = require('ton-client-node-js')

describe('Atomic Swap Redeem', function () {
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
            'timeLock': parseInt(Date.now() / 1000) + 60,
            'data': data.dataBase64
        })

        // Return address of Atomic Swap
        const atomicSwapAddress = result['value0']
        expect(atomicSwapAddress).to.be.not.equal(undefined)
        atomicSwapContract = new AtomicSwapContract(client, atomicSwapAddress)           
    })

    it('check params of Atomic Swap', async () => {

        const params = await atomicSwapContract.paramsLocal()

        // check params of Atomic Swap
        expect(parseInt(params['_amount'], 16), 'amount').to.be.equal(amount)
        expect(parseInt(params['_balance'], 16), 'balance gt').to.be.gt(amount)
        expect(parseInt(params['_timeLock'], 16), 'expired time').to.be.gt(Date.now() / 1000)
        expect(params['_initiator'], 'initiator').to.be.equal(`${initiatorContract.address}`)
        expect(params['_participant'], 'participant').to.be.equal(`${participantContract.address}`)
        expect(params['_secretHash'], 'secret hash').to.be.equal(`${secretHash}`)
    })

    it('redeem by participant', async () => {

        // redeem Atomic Swap
        const runBody = await client.contracts.createRunBody({
            abi: AtomicSwapContract.package.abi,
            function: "redeem",
            params: {
                secret: `${secret}`,
            },
            internal: true,
        })

        const params = { 
            dest: atomicSwapContract.address,
            value: 10_000_000,
            bounce: true,
            flag: 1,
            payload: runBody.bodyBase64
        }
        await participantContract.sendTransaction(params)

        // check Redeemed event and acquire secret
        {
            const msg = await client.queries.messages.waitFor({
                    src: { eq: atomicSwapContract.address },
                    msg_type: { eq: 2 },
                }, "body"
            )
            const event = await client.contracts.decodeOutputMessageBody({
                abi: AtomicSwapContract.package.abi,
                bodyBase64: msg['body'],
                internal: false,
            })

            expect(event.function).to.be.equal("Redeemed")
            expect(event.output.secret).to.be.equal(`${secret}`)       
        }

        // check that balance of participant is more
        const participantBalance = (await client.queries.accounts.query({
                id: { eq: participantContract.address },
            }, "balance"
        ))[0]['balance']

        expect(parseInt(participantBalance, 16)).to.be.gt(10_999_000_000)
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

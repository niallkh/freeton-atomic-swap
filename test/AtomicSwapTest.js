/* eslint-env mocha */
const expect = require('chai').expect
const getGramsFromGiver = require('./giver.js')
const AtomicSwapWalletContract = require('../ton/AtomicSwapWalletContract.js')
const AtomicSwapContract = require('../ton/AtomicSwapContract.js')
const { TONClient } = require('ton-client-node-js')

describe('Atomic Swap Wallet Test', function () {
    this.timeout(5000)

    let client
    let secretHash
    let secret
    let amount

    let initiatorContract
    let initiatorKeyPair

    let participantContract
    let participantKeyPair

    let atomicSwapAddress
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

        console.log(`secret    =${secret}`)
        console.log(`secretHash=${secretHash}`)
    })

    it('can\'t create Atomic Swap if not enough money', async () => {

        const data = await client.contracts.getDeployData({
            abi: AtomicSwapContract.package.abi,
            initParams: { secretHash: `${secretHash}` },
            publicKeyHex: '0000000000000000000000000000000000000000000000000000000000000000'
        })
        
        let err
        try {
            await initiatorContract.createSwap({
                'participant': participantContract.address, 
                'amount': 101_000_000_000,
                'time': 1_000, // sec
                'data': data.dataBase64
            })
        } catch(e) {
            err = e
        }
        
        expect(err.data.exit_code).to.be.equal(404)        
    })

    it('can\'t create Atomic Swap with zero time', async () => {

        const data = await client.contracts.getDeployData({
            abi: AtomicSwapContract.package.abi,
            initParams: {
                secretHash: `${secretHash}`,
            },
            publicKeyHex: '0000000000000000000000000000000000000000000000000000000000000000'
        })
        
        let err
        try {
            await initiatorContract.createSwap({
                'participant': participantContract.address, 
                'amount': amount,
                'time': 0, // sec
                'data': data.dataBase64
            })
        } catch(e) {
            err = e
        }
        
        expect(err.data.exit_code).to.be.equal(402)        
    })

    it('can\'t create Atomic Swap if participant is owner', async () => {

        const data = await client.contracts.getDeployData({
            abi: AtomicSwapContract.package.abi,
            initParams: {
                secretHash: `${secretHash}`,
            },
            publicKeyHex: '0000000000000000000000000000000000000000000000000000000000000000'
        })
        
        let err
        try {
            await initiatorContract.createSwap({
                'participant': initiatorContract.address, 
                'amount': amount,
                'time': 0, // sec
                'data': data.dataBase64
            })
        } catch(e) {
            err = e
        }
        
        expect(err.data.exit_code).to.be.equal(401)        
    })


    it('create Atomic Swap', async () => {

        const data = await client.contracts.getDeployData({
            abi: AtomicSwapContract.package.abi,
            initParams: {
                secretHash: `${secretHash}`,
            },
            publicKeyHex: '0000000000000000000000000000000000000000000000000000000000000000'
        })
        
        const result = await initiatorContract.createSwap({
            'participant': participantContract.address, 
            'amount': amount,
            'time': 1_000, // sec
            'data': data.dataBase64
        })
        atomicSwapAddress = result['value0']
        expect(atomicSwapAddress).to.be.not.equal(undefined)

        {
            const messages = (await client.queries.messages.query({
                    src: { eq: initiatorContract.address },
                    msg_type: { eq: 2 },
                }, "body"
            ))

            const events = await Promise.all(messages.map(async msg => await client.contracts.decodeOutputMessageBody({
                abi: AtomicSwapWalletContract.package.abi,
                bodyBase64: msg['body'],
                internal: false,
            })))

            const onInitiateEvent = events.find(event => event.function == "OnInitiate")
        
            expect(onInitiateEvent.output.atomicSwap).to.be.equal(atomicSwapAddress)
            expect(onInitiateEvent.output.secretHash).to.be.equal(`${secretHash}`)
        }            

        {
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

            const onInitiateEvent = events.find(event => event.function == "OnParticipate")
            
            expect(onInitiateEvent.output.atomicSwap).to.be.equal(atomicSwapAddress)
            expect(onInitiateEvent.output.secretHash).to.be.equal(`${secretHash}`)
        }
    })

    it('check params of Atomic Swap', async () => {
        atomicSwapContract = new AtomicSwapContract(client, atomicSwapAddress)

        const params = await atomicSwapContract.paramsLocal()
        
        expect(parseInt(params['_amount'], 16), 'amount').to.be.equal(amount)
        expect(parseInt(params['_balance'], 16), 'balance gt').to.be.gt(amount)
        expect(parseInt(params['_expiredTime'], 16), 'expired time').to.be.gt(Date.now() / 1000)
        expect(params['_owner'], 'owner').to.be.equal(`${initiatorContract.address}`)
        expect(params['_participant'], 'participant').to.be.equal(`${participantContract.address}`)
        expect(params['_secretHash'], 'secret hash').to.be.equal(`${secretHash}`)
        expect(params['_redeemed'], 'redeemed').to.be.equal(false)
        expect(params['_refunded'], 'refunded').to.be.equal(false)
    })

    it('redeem by participant', async () => {

        await participantContract.redeem({ 
            secretHash,
            secret: `0x${secret}`, 
        })

        {
            const msg = await client.queries.messages.waitFor({
                    src: { eq: atomicSwapAddress },
                    msg_type: { eq: 2 },
                }, "body"
            )
            const event = await client.contracts.decodeOutputMessageBody({
                abi: AtomicSwapContract.package.abi,
                bodyBase64: msg['body'],
                internal: false,
            })

            expect(event.function).to.be.equal("Redeemed")
            expect(event.output.addr).to.be.equal(participantContract.address)
            expect(event.output.secret).to.be.equal(`0x${secret}`)       
        }

        const participantBalance = (await client.queries.accounts.query({
                id: { eq: participantContract.address },
            }, "balance"
        ))[0]['balance']

        expect(parseInt(participantBalance, 16)).to.be.gt(amount)

        {
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

            const onRedeemedEvent = events.find(event => event.function == "OnRedeemed")

            expect(onRedeemedEvent.output.secretHash).to.be.equal(secretHash)
            expect(parseInt(onRedeemedEvent.output.amount, 16)).to.be.gt(amount)                   
        }
    })

    it('check params of Atomic Swap after redeem', async () => {
        const params = await atomicSwapContract.paramsLocal()
        
        expect(parseInt(params['_amount'], 16), 'amount').to.be.equal(amount)
        expect(parseInt(params['_balance'], 16), 'balance gt').to.be.lt(amount)
        expect(params['_redeemed'], 'redeemed').to.be.equal(true)
        expect(params['_refunded'], 'refunded').to.be.equal(false)
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

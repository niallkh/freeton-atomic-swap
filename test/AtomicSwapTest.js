const expect = require('chai').expect
const getGramsFromGiver = require('./giver.js');
const AtomicSwapWalletContract = require('../ton/AtomicSwapWallet/AtomicSwapWalletContract.js')
const AtomicSwapContract = require('../ton/AtomicSwap/AtomicSwapContract.js')
const { TONClient } = require('ton-client-node-js');

const SECRET = Math.random().toString() // FIXME insecure

describe('Atomic Swap Wallet Test', function () {
    this.timeout(5000);

    let client
    let secretHash

    let initiatorContract
    let initiatorKeyPair

    let participantContract
    let participantKeyPair

    let atomicSwapAddress

    before(async () => {
        client = await TONClient.create({servers: ['http://0.0.0.0']});

        initiatorKeyPair = await client.crypto.ed25519Keypair();

        secretHash = await client.crypto.sha256({ text: await client.crypto.sha256({ text: SECRET }) }) // FIXME, sha256 should accept HEX

        const codeAtomicSwap = await client.contracts.getCodeFromImage({
            imageBase64: AtomicSwapContract.package.imageBase64
        });

        const constructorParams = { '_codeAtomicSwap': codeAtomicSwap.codeBase64 }

        // Deploy Initiator Wallet
        {
            const address = await getFutureAddress(
                client, AtomicSwapWalletContract.package, initiatorKeyPair, constructorParams
            )
            await getGramsFromGiver(client, address, 100_000_000_000);
            initiatorContract = new AtomicSwapWalletContract(client, address, initiatorKeyPair);
            await initiatorContract.deploy(constructorParams)
            await client.queries.accounts.waitFor({
                id: { eq: address },
                acc_type_name: { eq: 'Active' }
            }, 'id');
        }

        // Deploy Participant Wallet
        {
            const address = await getFutureAddress(
                client, AtomicSwapWalletContract.package, initiatorKeyPair, constructorParams
            )
            await getGramsFromGiver(client, address, 1_000_000_000);
            participantContract = new AtomicSwapWalletContract(client, address, initiatorKeyPair);
            await participantContract.deploy(constructorParams)
            await client.queries.accounts.waitFor({
                id: { eq: address },
                acc_type_name: { eq: 'Active' }
            }, 'id');
        }
    })

    it('can\'t create Atomic Swap if not enough money', async () => {

        const data = await client.contracts.getDeployData({
            abi: AtomicSwapContract.package.abi,
            initParams: {
                secret_hash: `0x${secretHash}`,
            },
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
        
        expect(err.data.exit_code).to.be.equal(400)        
    })

    it('can\'t create Atomic Swap with negative time', async () => {

        const data = await client.contracts.getDeployData({
            abi: AtomicSwapContract.package.abi,
            initParams: {
                secret_hash: `0x${secretHash}`,
            },
            publicKeyHex: '0000000000000000000000000000000000000000000000000000000000000000'
        })
        
        let err
        try {
            await initiatorContract.createSwap({
                'participant': participantContract.address, 
                'amount': 101_000_000_000,
                'time': -1_000, // sec
                'data': data.dataBase64
            })
        } catch(e) {
            err = e
        }
        
        expect(err.data.exit_code).to.be.equal(400)        
    })

    it('create Atomic Swap', async () => {

        const data = await client.contracts.getDeployData({
            abi: AtomicSwapContract.package.abi,
            initParams: {
                secret_hash: `0x${secretHash}`,
            },
            publicKeyHex: '0000000000000000000000000000000000000000000000000000000000000000'
        })
        
        const result = await initiatorContract.createSwap({
            'participant': participantContract.address, 
            'amount': 1_000_000_000,
            'time': 1_000, // sec
            'data': data.dataBase64
        })

        atomicSwapAddress = result['value0']
        expect(atomicSwapAddress).to.be.not.equal(undefined)
    })

    it('check params of Atomic Swap', async () => {
        const atomicSwapContract = new AtomicSwapContract(client, atomicSwapAddress)

        const params = await atomicSwapContract.paramsLocal()
        
        expect(parseInt(params['_amount']), 16).to.be.equal(1_000_000_000)
        expect(parseInt(params['_balance']), 16).to.be.lt(1_000_000_000)
        expect(parseInt(params['_balance']), 16).to.be.gt(999_000_000)
        expect(parseInt(params['_expired_time']), 16).to.be.gt(Date.now() / 1000)
        expect(params['_owner'], 16).to.be.equal(`${initiatorContract.address}`)
        expect(params['_participant'], 16).to.be.equal(`${participantContract.address}`)
        expect(params['_secret_hash'], 16).to.be.equal(`0x${secretHash}`)
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
    })).address;
}

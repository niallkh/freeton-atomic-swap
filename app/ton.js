const { AtomicSwapContract, MultisigWalletContract, AtomicSwapWalletContract, getGramsFromGiver } = require("freeton-atomic-swap-ton")
const { TONClient } = require('ton-client-node-js')
const { 
    createClient, getFutureAddress, getKeyPair, 
    getBalance, waitActiveState, getAccountState, 
    saveWalletAddress, getWalletAddress, getCodeHash
} = require('./ton-utils.js')

const { createSecretAndHash, prettyNumber, resetStorage } = require('./common-utils.js')

async function computeAtomicSwapWalletAddress() {
    return await createClient(async client => {
        const package = AtomicSwapWalletContract.package
        const keyPair = await getKeyPair(client)

        const codeAtomicSwap = await client.contracts.getCodeFromImage({
            imageBase64: AtomicSwapContract.package.imageBase64
        })
        const constructorParams = { '_codeAtomicSwap': codeAtomicSwap.codeBase64 }

        const address = await getFutureAddress(client, package, keyPair, constructorParams)

        await saveWalletAddress(address)

        await client.close()

        return address
    })
}

async function deployAtomicSwapWallet() {
    return await createClient(async client => {
        const package = AtomicSwapWalletContract.package
        const keyPair = await getKeyPair(client)

        const codeAtomicSwap = await client.contracts.getCodeFromImage({
            imageBase64: AtomicSwapContract.package.imageBase64
        })
        const constructorParams = { '_codeAtomicSwap': codeAtomicSwap.codeBase64 }

        const walletAddress = await getFutureAddress(client, package, keyPair, constructorParams)

        if (await getBalance(client, walletAddress) == 0) 
            throw new Error(`Non positive balance at Atomic Swap Wallet address`)

        if (await getAccountState(client, walletAddress) == "Active") 
            throw new Error(`Wallet already deployed`)     

        const wallet = new AtomicSwapWalletContract(client, walletAddress, keyPair)
        await wallet.deploy(constructorParams)
        await saveWalletAddress(walletAddress)
        await waitActiveState(client, walletAddress)
    })
}

async function getWalletBalance() {
    return await createClient(async client => {
        const walletAddress = await getWalletAddress()        
        const balance = prettyNumber(await getBalance(client, walletAddress))

        return balance
    })
}

async function createAtomicSwap(participant, amount, time, secretHash = undefined) {
    return await createClient(async client => {
        const package = AtomicSwapWalletContract.package
        const keyPair = await getKeyPair(client)

        const walletAddress = await getWalletAddress()

        if (await getAccountState(client, walletAddress) != "Active") 
            throw new Error(`Wallet isn't deployed`)     

        const wallet = new AtomicSwapWalletContract(client, walletAddress, keyPair)

        let secret = undefined
        if (!secretHash) {
            secret = await createSecretAndHash()
        } 

        const data = await client.contracts.getDeployData({
            abi: AtomicSwapContract.package.abi,
            initParams: { secretHash: `0x${ secretHash ? secretHash : secret.secretHash }` },
            publicKeyHex: '0000000000000000000000000000000000000000000000000000000000000000'
        })

        const result = await wallet.createSwap({ // FIXME need to check state of the address
            'initiator': wallet.address, 
            'participant': participant, 
            'amount': amount,
            'timeLock': time,
            'data': data.dataBase64
        })

        const atomicSwapAddress = result['value0']
        return { 
            atomicSwapAddress,
            ...secret,
        }
    })
}

async function getAtomicSwapParams(address) {
    return await createClient(async client => {
        const atomicSwap = new AtomicSwapContract(client, address)
        const params = await atomicSwap.paramsLocal()
        return {
            initiator: params['_initiator'],
            participant: params['_participant'],
            secretHash: params['_secretHash'],
            amount: prettyNumber(parseInt(params['_amount'], 16)),
            atomicSwapBalance: prettyNumber(parseInt(params['_balance'], 16)),
            now: prettyNumber(parseInt(params['_now'], 16)),
            timeLock: prettyNumber(parseInt(params['_timeLock'], 16)),
            codeHash: await getCodeHash(client, address)
        }
    })
}

async function redeemAtomicSwap(address, secret) {
    return await createClient(async client => {
        
        const keyPair = await getKeyPair(client)
        const walletAddress = await getWalletAddress()

        if (await getAccountState(client, walletAddress) != "Active") 
            throw new Error(`Wallet isn't deployed`)     

        const wallet = new AtomicSwapWalletContract(client, walletAddress, keyPair)

        const runBody = await client.contracts.createRunBody({
            abi: AtomicSwapContract.package.abi,
            function: "redeem",
            params: { secret: `${secret}` },
            internal: true,
        })

        const params = { 
            dest: address,
            value: 10_000_000,
            bounce: true,
            flag: 1,
            payload: runBody.bodyBase64
        }

        await wallet.sendTransaction(params)

        await client.queries.messages.waitFor({
                src: { eq: address },
                msg_type: { eq: 2 },
            }, "body", 60_000
        )
    })
} 

async function getAtomicSwapSecret(address) {
    return await createClient(async client => {
        const msg = await client.queries.messages.waitFor({
                src: { eq: address },
                msg_type: { eq: 2 },
            }, "body"
        )

        const event = await client.contracts.decodeOutputMessageBody({
            abi: AtomicSwapContract.package.abi,
            bodyBase64: msg['body'],
            internal: false,
        })

        return event.output.secret
    })
}

async function sendGramsFromGiver(address, amount) {
    return await createClient(async client => {
        await getGramsFromGiver(client, address, amount)        
    })
}

async function refundAtomicSwap(address) {
    return await createClient(async client => {

        const keyPair = await getKeyPair(client)
        const walletAddress = await getWalletAddress()

        if (await getAccountState(client, walletAddress) != "Active") 
            throw new Error(`Wallet isn't deployed`)     

        const wallet = new AtomicSwapWalletContract(client, walletAddress, keyPair)

        const runBody = await client.contracts.createRunBody({
            abi: AtomicSwapContract.package.abi,
            function: "refund",
            params: {},
            internal: true,
        })

        const params = { 
            dest: address,
            value: 10_000_000,
            bounce: true,
            flag: 1,
            payload: runBody.bodyBase64
        }

        await wallet.sendTransaction(params)
    })
}

async function transfer(address, amount) {
    return await createClient(async client => {
        const keyPair = await getKeyPair(client)
        const walletAddress = await getWalletAddress()

        if (await getAccountState(client, walletAddress) != "Active") 
            throw new Error(`Wallet isn't deployed`)     

        const wallet = new AtomicSwapWalletContract(client, walletAddress, keyPair)

        const params = { 
            dest: address,
            value: amount,
            bounce: true,
            flag: 1,
            payload: ""
        }

        await wallet.sendTransaction(params)
    })
}

async function reset() {
    return await createClient(async client => {
        await resetStorage()
    })
}

module.exports = {
    computeAtomicSwapWalletAddress,
    deployAtomicSwapWallet,
    sendGramsFromGiver,
    createAtomicSwap,
    getWalletBalance,
    getAtomicSwapParams,
    redeemAtomicSwap,
    getAtomicSwapSecret,
    refundAtomicSwap,
    reset,
    transfer
}


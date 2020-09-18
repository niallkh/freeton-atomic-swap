const { AtomicSwapContract, MultisigWalletContract, AtomicSwapWalletContract } = require("freeton-atomic-swap-ton")
const { TONClient } = require('ton-client-node-js')
const { save, load, prettyNumber } = require('./common-utils.js')

async function createClient(block) {
    const client = await TONClient.create({servers: [process.env.TON_SERVER]})
     try {
        return await block(client)         
     } catch(e) {
         throw e
     } finally {
        await client.close()
     }
}

async function getBalance(client, address) {
    const balance = (await client.queries.accounts.query({
        id: { eq: address },
    }, "balance"
    ))[0]['balance']

    return parseInt(balance, 16)
}

async function waitActiveState(client, address) {
    await client.queries.accounts.waitFor({
        id: { eq: address },
        acc_type_name: { eq: 'Active' }
    }, 'id', 10_000)
}

async function getAccountState(client, address) {
    return (await client.queries.accounts.query({
        id: { eq: address },
    }, 'acc_type_name'
    ))[0]['acc_type_name']
}

async function getCodeHash(client, address) {
    const codeHash = (await client.queries.accounts.query({
        id: { eq: address },
    }, "code_hash"
    ))[0]['code_hash']

    return codeHash
}

async function saveWalletAddress(address) {
    await save({ walletAddress: address })
}

async function getWalletAddress() {
    const { walletAddress } = await load()
    if (walletAddress) {
        return walletAddress
    } else {
        throw new Error("Wallet address is not saved")
    }
}

async function getFutureAddress(client, package, keyPair, constructorParams = {}, initParams = {}) {
    return (await client.contracts.createDeployMessage({
        package,
        constructorParams,
        keyPair,
        initParams,
    })).address
}

async function getKeyPair(client) {
    const { keyPair } = await load()
    if (keyPair) {
        return keyPair
    } else {
        const newKeyPair = await client.crypto.ed25519Keypair()
        await save({ keyPair: newKeyPair })
        return newKeyPair
    }
}   

module.exports = {
    createClient,
    getFutureAddress,
    getKeyPair,
    getBalance,
    getAccountState,
    waitActiveState,
    getWalletAddress,
    saveWalletAddress,
    prettyNumber,
    getCodeHash    
}

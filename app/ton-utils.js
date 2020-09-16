const { AtomicSwapContract, MultisigWalletContract, AtomicSwapWalletContract } = require("freeton-atomic-swap-ton")
const { createSecretAndHash } = require("freeton-atomic-swap-btc")
const util = require('util');
const fs = require('fs')
const { TONClient } = require('ton-client-node-js')

const readAsync = util.promisify(fs.readFile);
const writeAsync = util.promisify(fs.writeFile);
const accessAsync = util.promisify(fs.access);
const unlinkAsync = util.promisify(fs.unlink);

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

async function save(update) {
    const db = await load()
    await writeAsync(dbName(), JSON.stringify({ ...db, ...update }, null, 2))
}

async function load() {
    const db = dbName()
    try {
        await accessAsync(db, fs.constants.F_OK)
        return JSON.parse(await readAsync(db))
    } catch(e) {
        return {}
    }
}

async function resetStorage() {
    await writeAsync(dbName(), JSON.stringify({}, null, 2))
}

function prettyNumber(balance) {
    const str = balance.toString()
    let result = ""
    for (let i = 0; i < str.length; i++) {
        result += str[i]
        if (i != str.length - 1 && (str.length - i) % 3 == 1) {
          result += '_'
        }
    }
    return result
}

function dbName() {
    return `${process.env.USER}-${process.env.DB_NAME}.json`
}

module.exports = {
    createClient,
    getFutureAddress,
    getKeyPair,
    getBalance,
    getAccountState,
    waitActiveState,
    createSecretAndHash,
    getWalletAddress,
    saveWalletAddress,
    prettyNumber,
    resetStorage
}

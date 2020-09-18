const bitcoin = require('bitcoinjs-lib')
const { alice, bob, dave } = require('./wallets.json')
const giver = dave
const network = bitcoin.networks.regtest
const bip65 = require('bip65')
const {    
    createAtomicSwap,
    verifyAtomicSwap,
    createRedeemScript,
    createRefundScript,
    createSecretAndHash,
    createTimeLock
} = require("../contracts/AtomicSwap.js")
const fs = require('fs')
const util = require('util');
const readAsync = util.promisify(fs.readFile);
const writeAsync = util.promisify(fs.writeFile);

const keyPairDave = bitcoin.ECPair.fromWIF(dave[1].wif, network)
const keyPairBob = bitcoin.ECPair.fromWIF(bob[1].wif, network)
const keyPairAlice = bitcoin.ECPair.fromWIF(alice[1].wif, network)


async function main() {

    if (process.argv[2] == "create") {
        const { secret, secretHash } = await createSecretAndHash()
        const timeLock = await createTimeLock(24)
        const { p2shAddress } = await createAtomicSwap(network, keyPairDave.publicKey, keyPairAlice.publicKey, secretHash, timeLock)
        await updateDb({ secret, secretHash, timeLock })
        console.log(`p2shAddress=${JSON.stringify(p2shAddress, null, 2)}`)
    
    } else if (process.argv[2] == "verify") {
        const p2shAddress = process.argv[3]
        const { secret, secretHash, timeLock } = await readDb()
        const verified = await verifyAtomicSwap(network, keyPairDave.publicKey, keyPairAlice.publicKey, secretHash, timeLock, p2shAddress)
        console.log(`verified=${verified}`)

    } else if (process.argv[2] == "redeem") {
        const { secret, secretHash, timeLock } = await readDb()
        const tx = {
            id: process.argv[3],
            vout: process.argv[4],
            hex: process.argv[5]
        }
        const txRedeem = await createRedeemScript(network, keyPairDave.publicKey, keyPairAlice, alice[1].p2wpkh, secret, secretHash, timeLock, tx, 999e5)
        console.log(`txRedeem=${txRedeem}`)

    } else if (process.argv[2] == "refund") {
        const { secretHash, timeLock } = await readDb()
        const tx = {
            id: process.argv[3],
            vout: process.argv[4],
            hex: process.argv[5]
        }
        const txRefund = await createRefundScript(network, keyPairDave, keyPairAlice.publicKey, dave[1].p2wpkh, secretHash, timeLock, tx)
        console.log(`txRefund=${txRefund}`)
    }
}

async function updateDb(update) {
    const db = JSON.parse(await readAsync("db.json"))
    await writeAsync("db.json", JSON.stringify({ ...db, ...update }, null, 2))
}

async function readDb() {
    return JSON.parse(await readAsync("db.json"))
}

main()

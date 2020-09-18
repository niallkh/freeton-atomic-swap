const {
    createAtomicSwap, verifyAtomicSwap, createRedeemScript,
    createRefundScript, createSecretAndHash, createTimeLock,
    hashSecret, walletFrom
} = require('freeton-atomic-swap-btc')
const { getKeys, btcNetwork } = require('./btc-utils.js')
const bitcoin = require('bitcoinjs-lib')

async function getWallet() {
    return await getKeys()
}

async function createAtomicSwapBtc(participant, timeLock, secretHash) {
    const { publicKey } = await getKeys()

    let secret = undefined
    if (!secretHash) {
        secret = await createSecretAndHash()
        secretHash = secret.secretHash
    } 

    const p2shAddress = await createAtomicSwap(btcNetwork(), publicKey, participant, secretHash, timeLock)

    return { 
        initiator: publicKey,
        participant, 
        timeLock,
        ...p2shAddress,  
        ...secret
    }
}

async function verifyAtomicSwapBtc(initiator, secretHash, timeLock, p2shAddress) {
    const { publicKey } = await getKeys()
    return await verifyAtomicSwap(btcNetwork(), initiator, publicKey, secretHash, timeLock, p2shAddress)
}

async function redeemAtomicSwap(initiator, secret, timeLock, tx, fee) {
    const secretHash = await hashSecret(secret)
    const { address, privateKey } = await getKeys()
    const wallet = await walletFrom(privateKey)

    return await createRedeemScript(
        btcNetwork(),
        initiator,
        wallet,
        address,
        secret,
        secretHash,
        timeLock,
        tx,
        fee
    )
}

async function refundAtomicSwap(participant, secretHash, timeLock, tx, fee) {
    const { address, privateKey } = await getKeys()
    const wallet = await walletFrom(privateKey)

    return await createRefundScript(
        btcNetwork(),
        wallet,
        participant,
        address,
        secretHash,
        timeLock,
        tx,
        fee
    )
}

module.exports = {
    getWallet,
    createAtomicSwap: createAtomicSwapBtc,
    verifyAtomicSwap: verifyAtomicSwapBtc,
    redeemAtomicSwap
}

const bitcoin = require('bitcoinjs-lib')
const bip65 = require('bip65')
const crypto = require('crypto')
const { createAtomicSwapScript } = require('./AtomicSwapContracts.js')

async function createAtomicSwap(network, initiator, participant, secretHash, timeLockHours) {
    const lockTime = bip65.encode({utc: Math.floor(Date.now() / 1000) - (3600 * timeLockHours)}) 
    
    const redeemScript = createAtomicSwap(
        secretHash, initiator.publicKey, participant.publicKey, lockTime
    )

    const p2sh = bitcoin.payments.p2sh({redeem: {output: redeemScript, network}, network})

    return {
        p2shAddress: p2sh.address
    }
}

async function createSecretAndHash() {
    const secret = crypto.randomBytes(32).toString('hex')
    const secretHash = crypto.createHash('sha256')
        .update(secret, 'hex').digest('hex')

    return {
        secret,
        secretHash
    }
}
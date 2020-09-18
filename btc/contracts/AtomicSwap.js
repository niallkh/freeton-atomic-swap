const bitcoin = require('bitcoinjs-lib')
const bip65 = require('bip65')
const crypto = require('crypto')
const { createAtomicSwapScript, createAtomicSwapRedeemScript, createAtomicSwapRefundScript } = require('./AtomicSwapContracts.js')

async function genWallet() {
    return bitcoin.ECPair.makeRandom()
}

async function walletFrom(privateKey) {
    return bitcoin.ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'))
}

async function createAtomicSwap(network, initiatorPK, participantPK, secretHash, timeLock) {
    const lockTime = bip65.encode({ utc: timeLock }) 
    
    const atomicSwapScript = createAtomicSwapScript(
        secretHash, initiatorPK, participantPK, lockTime
    )

    const p2sh = bitcoin.payments.p2sh({ redeem: { output: atomicSwapScript, network }, network })

    return { p2shAddress: p2sh.address }
}

async function verifyAtomicSwap(network, initiatorPK, participantPK, secretHash, timeLock, p2shAddress) {
    const atomicSwapAddress = await createAtomicSwap(network, initiatorPK, participantPK, secretHash, timeLock, p2shAddress)
    return atomicSwapAddress.p2shAddress == p2shAddress
}

async function createRedeemScript(network, initiatorPK, participant, participantP2wpkh, secret, secretHash, timeLock, tx, fee) {
    const lockTime = bip65.encode({ utc: parseInt(timeLock) }) 
    const atomicSwapScript = createAtomicSwapScript(
        secretHash, initiatorPK, participant.publicKey, lockTime
    )

    const psbt = new bitcoin.Psbt({network})

    psbt.addInput({
      hash: tx.id,
      index: parseInt(tx.vout),
      sequence: 0xfffffffe, 
      nonWitnessUtxo: Buffer.from(tx.hex, 'hex'),
      redeemScript: Buffer.from(atomicSwapScript, 'hex')
    })

    psbt.addOutput({
      address: participantP2wpkh,
      value: fee ? fee : 999e5,
    })

    psbt.signInput(0, participant)

    psbt.finalizeInput(0, (inputIndex, input, script) => {
        
        const decompiled = bitcoin.script.decompile(script)
        if (!decompiled || decompiled[0] !== bitcoin.opcodes.OP_IF) {
          throw new Error(`Can not finalize input #${inputIndex}`)
        }

        const redeemScript = createAtomicSwapRedeemScript(
            input.partialSig[0].signature, participant.publicKey, secret
        )

        const payment = bitcoin.payments.p2sh({
            redeem: {
                input: redeemScript,
                output: atomicSwapScript
            }
        })

        return { finalScriptSig: payment.input }
    })

    return psbt.extractTransaction().toHex()
}

async function createRefundScript(network, initiator, participantPK, initiatorP2wpkh, secretHash, timeLock, tx, fee) {
    const lockTime = bip65.encode({ utc: parseInt(timeLock) }) 
    const atomicSwapScript = createAtomicSwapScript(
        secretHash, initiator.publicKey, participantPK, lockTime
    )
    const psbt = new bitcoin.Psbt({network})

    psbt.setLocktime(timeLock)

    psbt.addInput({
      hash: tx.id,
      index: parseInt(tx.vout),
      sequence: 0xfffffffe, 
      nonWitnessUtxo: Buffer.from(tx.hex, 'hex'),
      redeemScript: Buffer.from(atomicSwapScript, 'hex')
    })

    psbt.addOutput({
      address: initiatorP2wpkh,
      value: fee ? fee : 999e5,
    })

    psbt.signInput(0, initiator)

    psbt.finalizeInput(0, async (inputIndex, input, script) => {
        
        const decompiled = bitcoin.script.decompile(script)
        if (!decompiled || decompiled[0] !== bitcoin.opcodes.OP_IF) {
          throw new Error(`Can not finalize input #${inputIndex}`)
        }

        const refundScript = createAtomicSwapRefundScript(
            input.partialSig[0].signature, initiator.publicKey
        )

        const payment = bitcoin.payments.p2sh({
            redeem: {
                input: refundScript,
                output: atomicSwapScript
            }
        })

        return { finalScriptSig: payment.input }
    })

    return psbt.extractTransaction().toHex()
}

async function createSecretAndHash() {
    const secret = await crypto.randomBytes(32).toString('hex')
    const secretHash = await crypto.createHash('sha256')
        .update(secret, 'hex')
        .digest('hex')

    return {
        secret,
        secretHash
    }
}

async function hashSecret(secret) {
    const secretHash = await crypto.createHash('sha256')
        .update(secret, 'hex')
        .digest('hex')

    return secretHash
}


async function createTimeLock(hours) {
    return Math.floor(Date.now() / 1000) + (3600 * hours)
}

module.exports = {
    createAtomicSwap,
    verifyAtomicSwap,
    createRedeemScript,
    createRefundScript,
    createSecretAndHash,
    createTimeLock,
    genWallet,
    hashSecret,
    walletFrom
}

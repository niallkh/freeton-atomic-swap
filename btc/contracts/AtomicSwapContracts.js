const bitcoin = require('bitcoinjs-lib')
 

/**
 * Creates an atomic swap contract using Bitcoin Script.
 *
 * @param      secretHash         The secret hash
 * @param      initiatorPubKey    The initiator pub key
 * @param      participantPubKey  The participant pub key
 * @param      lockTime           The lock time
 * @return     hex of Atomic Swap Smart Contract 
 */
function createAtomicSwapScript(secretHash, initiatorPubKey, participantPubKey, lockTime) {
    return bitcoin.script.fromASM(
        `
        OP_IF
            OP_SIZE
            20
            OP_EQUALVERIFY

            OP_SHA256
            ${secretHash}
            OP_EQUALVERIFY

            OP_DUP
            ${participantPubKey.toString('hex')}

        OP_ELSE
            ${bitcoin.script.number.encode(lockTime).toString('hex')}
            OP_CHECKLOCKTIMEVERIFY
            OP_DROP

            OP_DUP
            ${initiatorPubKey.toString('hex')}

        OP_ENDIF

        OP_EQUALVERIFY
        OP_CHECKSIG
        `
        .trim()
        .replace(/\s+/g, ' '),
    )
}

/**
 * Creates an atomic swap redeem script. Can be used together with #createAtomicSwapScript.
 *
 * @param      signature          The signature
 * @param      participantPubKey  The participant pub key
 * @param      secret             The secret
 * @return     hex of Atomic Swap Redeem Smart Contract 
 */
function createAtomicSwapRedeemScript(signature, participantPubKey, secret) {
    return bitcoin.script.fromASM(
        `
        ${signature.toString('hex')}
        ${participantPubKey.toString('hex')}
        ${secret}
        01
        `
        .trim()
        .replace(/\s+/g, ' '),
    )
}

/**
 * Creates an atomic swap redeem script. Can be used together with #createAtomicSwapScript.
 *
 * @param      signature        The signature
 * @param      initiatorPubKey  The initiator pub key
 * @return     hex of Atomic Swap Refund Smart Contract
 */
function createAtomicSwapRefundScript(signature, initiatorPubKey) {
    return bitcoin.script.fromASM(
        `
        ${signature.toString('hex')}
        ${initiatorPubKey.toString('hex')}
        00
        `
        .trim()
        .replace(/\s+/g, ' '),
    )
}

module.exports = {
    createAtomicSwapScript,
    createAtomicSwapRedeemScript,
    createAtomicSwapRefundScript
}

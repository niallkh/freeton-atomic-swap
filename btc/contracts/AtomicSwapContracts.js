const bitcoin = require('bitcoinjs-lib')
    
function createAtomicSwapScript(secretHash, initiatorPubKey, participantPubKey, lockTime) {
    return bitcoin.script.fromASM(
        `
        OP_IF
            OP_SHA256
            ${secretHash}}
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

function createAtomicSwapRedeemScript(signature, participantPubKey, secret) {
    return bitcoin.script.fromASM(
        `
        ${signature}
        ${participantPubkey.toString('hex')}
        ${secret}
        1
        `
        .trim()
        .replace(/\s+/g, ' '),
    )
}

function createAtomicSwapRefundScript(signature, initiatorPubKey) {
    return bitcoin.script.fromASM(
        `
        ${signature}
        ${initiatorPubKey.toString('hex')}
        0
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
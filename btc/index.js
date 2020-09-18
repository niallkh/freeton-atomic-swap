const {    
    createAtomicSwap,
    verifyAtomicSwap,
    createRedeemScript,
    createRefundScript,
    createSecretAndHash,
    createTimeLock,
    genWallet,
    hashSecret,
    walletFrom
} = require("./contracts/AtomicSwap.js")

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

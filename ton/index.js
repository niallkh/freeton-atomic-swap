const AtomicSwapContract = require('./contracts/AtomicSwapContract.js')
const MultisigWalletContract = require('./contracts/SetcodeMultisigWalletContract.js')
const AtomicSwapWalletContract = require("./contracts/AtomicSwapWalletContract.js")
const getGramsFromGiver = require("./test/giver.js")

module.exports = {
    AtomicSwapContract,
    MultisigWalletContract,
    AtomicSwapWalletContract,
    getGramsFromGiver
}
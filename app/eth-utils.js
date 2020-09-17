const Wallet = require('ethereumjs-wallet')
const Web3 = require('web3')
const { loadAtomicSwapAbi, atomicSwapAddress } = require('freeton-atomic-swap-eth')
const { save, load, prettyNumber, resetStorage } = require('./common-utils.js')

async function getPrivateKey() {
    const { privateKey } = await load()
    if (privateKey) {
        return privateKey
    } else {
        const web3 = new Web3()
        const account = web3.eth.accounts.create(web3.utils.randomHex(32))
        await save({ privateKey: account.privateKey })
        return account.privateKey
    }
}

async function createAtomicSwapContract(web3) {
    const abi = await loadAtomicSwapAbi()
    return new web3.eth.Contract(abi.abi, atomicSwapAddress)
}

module.exports = {
    getPrivateKey,
    prettyNumber, 
    resetStorage,
    createAtomicSwapContract
}
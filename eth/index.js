const atomicSwapAddress = require("./atomic-swap-address.json")
const fs = require('fs')
const util = require('util')

const readAsync = util.promisify(fs.readFile)

const ATOMIC_SWAP_ABI = "eth/build/contracts/AtomicSwap.json"

module.exports = {
    atomicSwapAddress: atomicSwapAddress.address,
    loadAtomicSwapAbi: async () => JSON.parse(await readAsync(ATOMIC_SWAP_ABI))
}
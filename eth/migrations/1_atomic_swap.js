/* global artifacts */
const fs = require('fs')

const AtomicSwap = artifacts.require("AtomicSwap")

module.exports = (deployer, network) => {
  deployer.deploy(AtomicSwap)
    .then(() => {
      fs.writeFileSync("atomic-swap-address.json", JSON.stringify({ address: AtomicSwap.address, network }, null, 2))
    })
};

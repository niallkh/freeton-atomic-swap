const bitcoin = require('bitcoinjs-lib')
const {
    createAtomicSwap, verifyAtomicSwap, createRedeemScript,
    createRefundScript, createSecretAndHash, createTimeLock, 
    genWallet
} = require('freeton-atomic-swap-btc')
const { save, load, prettyNumber, resetStorage } = require('./common-utils.js')

async function getKeys() {
    const { btcKeyPair } = await load()
    if (btcKeyPair) {
        return btcKeyPair
    } else {
        const wallet = await genWallet()
        const { address } = bitcoin.payments.p2pkh({ 
            pubkey: wallet.publicKey,
            network: btcNetwork(),
        })
        const keys = { 
            publicKey: wallet.publicKey.toString('hex'), 
            privateKey: wallet.privateKey.toString('hex'),
            address
        }
        await save({ btcKeyPair: keys })
        return keys
    }
}

function btcNetwork() {
    const btcNetwork = process.env.BTC_NETWORK
    if (btcNetwork == 'regtest') {
        return bitcoin.networks.regtest
    } else if (btcNetwork == 'testnet') {
        return bitcoin.networks.testnet
    } else {
        throw new Error("Unknown BTC network")
    }
}   

module.exports = {
    getKeys,
    btcNetwork
}
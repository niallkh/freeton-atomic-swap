const { getPrivateKey, createAtomicSwapContract } = require('./eth-utils.js')
const { prettyNumber, createSecretAndHash } = require('./common-utils')
const HDWalletProvider = require("@truffle/hdwallet-provider")
const Web3 = require("web3")

async function createWeb3(block) {
    const privateKey = await getPrivateKey()
    const provider = new HDWalletProvider(privateKey, process.env.ETH_SERVER)
    try {
        return await block(new Web3(provider))
    } catch(e) {
        throw e
    } finally {
        provider.engine.stop()        
    }
}

async function getWalletAddress() {
    return await createWeb3(async web3 => {
        const accounts = await web3.eth.getAccounts()
        return accounts[0]
    })
}

async function getWalletBalance() {
    return await createWeb3(async web3 => {
        const accounts = await web3.eth.getAccounts()
        const account = accounts[0]
        const balance = await web3.eth.getBalance(account, 'pending')
        return prettyNumber(parseInt(balance))
    })
}

async function createAtomicSwap(participant, eths, timeLock, secretHash, erc20) {
    return await createWeb3(async web3 => {
        const atomicSwap = await createAtomicSwapContract(web3)

        const accounts = await web3.eth.getAccounts()
        const initiator = accounts[0]
        const amount = web3.utils.toWei(eths.toString(), 'ether')

        let secret = undefined
        if (!secretHash) {
            secret = await createSecretAndHash()
            secretHash = secret.secretHash
        } 

        if (erc20) {
            await atomicSwap.methods.createSwapErc20(
                `0x${secretHash}`,
                participant,
                amount,
                timeLock,
                erc20
            ).send({ from: initiator, value: amount })

        } else {
            await atomicSwap.methods.createSwap(
                `0x${secretHash}`,
                participant,
                amount,
                timeLock,
            ).send({ from: initiator, value: amount })
        }
        
        return {
            atomicSwapAddress: atomicSwap.address,
            ...secret
        }
    })
}

async function getAtomicSwapParams(secretHash) {
    return await createWeb3(async web3 => {
        const atomicSwap = await createAtomicSwapContract(web3)

        const params = await atomicSwap.methods.params(
            `0x${secretHash}`,
        ).call()

        return params
    })
}

async function redeemAtomicSwap(secret) {
    return await createWeb3(async web3 => {
        const atomicSwap = await createAtomicSwapContract(web3)

        const accounts = await web3.eth.getAccounts()
        const account = accounts[0]

        await atomicSwap.methods.redeem(
            `0x${secret}`,
        ).send({ from: account })
    })
}

async function refundAtomicSwap(secretHash) {
    return await createWeb3(async web3 => {
        const atomicSwap = await createAtomicSwapContract(web3)

        const accounts = await web3.eth.getAccounts()
        const account = accounts[0]

        await atomicSwap.methods.refund(
            `0x${secretHash}`,
        ).send({ from: account })
    })
}

async function getAtomicSwapSecret(secretHash) {
    return await createWeb3(async web3 => {
        const atomicSwap = await createAtomicSwapContract(web3)

        const accounts = await web3.eth.getAccounts()
        const account = accounts[0]

        const events = await atomicSwap.getPastEvents('Redeemed', { fromBlock: 0, toBlock: 'latest' })
        console.log(`${JSON.stringify(events, null, 2)}`)

        const event = events.find(event => event.returnValues.secretHash == `0x${secretHash}`)

        return event ? event.returnValues.secret : 'Not found'
    })    
} 

module.exports = {
    getWalletAddress,
    getWalletBalance,
    createAtomicSwap,
    getAtomicSwapParams,
    redeemAtomicSwap,
    refundAtomicSwap,
    getAtomicSwapSecret
}

async function delay(time) {
    return new Promise(res => {
        setTimeout(function() {
            res()
        }, time);
    })
}

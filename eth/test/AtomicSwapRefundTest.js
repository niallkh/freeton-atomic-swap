/* eslint-env mocha */
/* global artifacts contract web3 */

const AtomicSwap = artifacts.require("AtomicSwap")
const expect = require('chai').expect

contract("AtomicSwap refund", async accounts => {
    const initiator = accounts[0]
    const participant = accounts[1]

    const amount = await web3.utils.toWei("10", "ether")
    let timeLock 

    let atomicSwapContract
    let secret 
    let secretHash 

    before("setup contract", async () => {
        atomicSwapContract = await AtomicSwap.new()
        secret = await web3.utils.randomHex(32)
        secretHash = await atomicSwapContract.hashSecret(secret)
    });

    it('create swap', async () => {

        timeLock = parseInt(Date.now() / 1000) + 2
        // create swap
        await atomicSwapContract.createSwap(
            secretHash,
            participant,
            amount,
            timeLock,
            { from: initiator, value: amount }
        )

        // check event AtomicSwapCreated
        const events = await atomicSwapContract.getPastEvents("AtomicSwapCreated")

        expect(events[0].args.secretHash.toString()).to.be.equal(secretHash.toString())

        // check params of Atomic Swap
        const params = await atomicSwapContract.params(secretHash)

        expect(params.initiator).to.be.equal(initiator)
        expect(params.participant).to.be.equal(participant)
        expect(params.timeLock.toString()).to.be.equal(timeLock.toString())
        expect(params.value.toString()).to.be.equal(amount.toString())
        expect(params.swapType.toString()).to.be.equal("0")
    })

    it('wait until Atomic Swap expired', async function() {
        this.timeout(3_500)
        await delay(3_000)
    })

    it('refund', async () => {
        const balanceBeforeSwap = await web3.eth.getBalance(initiator)

        // redeem Atomic Swap
        await atomicSwapContract.refund(
            secretHash,
            { from: initiator }
        )

        const balanceAfterSwap = await web3.eth.getBalance(initiator)
        
        expect(parseInt(balanceAfterSwap.slice(0, 6))).to.be.gt(parseInt(balanceBeforeSwap.slice(0, 6)))

        // check that Atomic Swap was deleted
        let err
        try {
            await atomicSwapContract.params(secretHash)
        } catch(e) {
            err = e
        }

        expect(err).to.be.not.equal(undefined)
    })    
})

async function delay(time) {
    return new Promise(res => {
        setTimeout(function() {
            res()
        }, time);
    })
}

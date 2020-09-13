/* eslint-env mocha */
/* global artifacts contract web3 */

const AtomicSwap = artifacts.require("AtomicSwap")
const expect = require('chai').expect

contract("AtomicSwap redeen", async accounts => {
    const initiator = accounts[0]
    const participant = accounts[1]

    const amount = await web3.utils.toWei("10", "ether")
    const timeLock = parseInt(Date.now() / 1000) + 60

    let atomicSwapContract
    let secret 
    let secretHash 

    before("setup contract", async () => {
        atomicSwapContract = await AtomicSwap.new()
        secret = await web3.utils.randomHex(32)
        secretHash = await atomicSwapContract.hashSecret(secret)
    });

    it('create swap', async () => {

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

    it('redeem', async () => {
        const balanceBeforeSwap = await web3.eth.getBalance(participant)

        // redeem Atomic Swap
        await atomicSwapContract.redeem(
            secret,
            { from: participant }
        )

        // check Redeemed event
        const events = await atomicSwapContract.getPastEvents("Redeemed")

        const balanceAfterSwap = await web3.eth.getBalance(participant)
        
        expect(events[0].args.secret.toString()).to.be.equal(secret.toString())
        expect(parseInt(balanceAfterSwap.slice(0, 6))).to.be
            .gt(parseInt(balanceBeforeSwap.slice(0, 6)))

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

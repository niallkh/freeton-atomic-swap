/* eslint-env mocha */
/* global artifacts contract web3 */

const AtomicSwap = artifacts.require("AtomicSwap")
const ERC20Token = artifacts.require("ERC20Token")
const expect = require('chai').expect
const BigNumber = require('bignumber.js')

contract("AtomicSwap redeem erc20", async accounts => {
    const initiator = accounts[0]
    const participant = accounts[1]

    const amount = (new BigNumber("10")).pow(18)
    const timeLock = parseInt(Date.now() / 1000) + 60

    let atomicSwapContract
    let erc20TokenContract
    let secret 
    let secretHash 

    before("setup contract", async () => {
        atomicSwapContract = await AtomicSwap.new()
        erc20TokenContract = await ERC20Token.new(100, { from: initiator })
        secret = await web3.utils.randomHex(32)
        secretHash = await atomicSwapContract.hashSecret(secret)
    });

    it('create swap', async () => {

        await erc20TokenContract.approve(
            atomicSwapContract.address,
            amount,
            { from: initiator }
        )

        // create swap
        try {
            await atomicSwapContract.createSwapErc20(
                secretHash,
                participant,
                amount,
                timeLock,
                erc20TokenContract.address,
                { from: initiator }
            )
        } catch(e) {
            console.log(e)
        }

        // check event AtomicSwapCreated
        const events = await atomicSwapContract.getPastEvents("AtomicSwapCreated")

        expect(events[0].args.secretHash.toString()).to.be.equal(secretHash.toString())

        // check params of Atomic Swap
        const params = await atomicSwapContract.params(secretHash)

        expect(params.initiator).to.be.equal(initiator)
        expect(params.participant).to.be.equal(participant)
        expect(params.timeLock.toString()).to.be.equal(timeLock.toString())
        expect(params.value.toString()).to.be.equal(amount.toString())
        expect(params.swapType.toString()).to.be.equal("1")
        expect(params.tokenAddr.toString()).to.be.equal(erc20TokenContract.address)
    })    

    it('redeem', async () => {
        const balanceBeforeSwap = await erc20TokenContract.balanceOf(participant)

        // redeem Atomic Swap
        await atomicSwapContract.redeem(
            secret,
            { from: participant }
        )

        // check Redeemed event
        const events = await atomicSwapContract.getPastEvents("Redeemed")

        const balanceAfterSwap = await erc20TokenContract.balanceOf(participant)
        
        expect(events[0].args.secret.toString()).to.be.equal(secret.toString())
        expect(balanceBeforeSwap.toString()).to.be.equal("0")
        expect(balanceAfterSwap.toString()).to.be.equal(amount.toString())

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

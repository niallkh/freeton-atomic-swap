/* eslint-env mocha */
/* global artifacts contract web3 */

const AtomicSwap = artifacts.require("AtomicSwap")
const ERC20Token = artifacts.require("ERC20Token")
const expect = require('chai').expect
const BigNumber = require('bignumber.js')

contract("AtomicSwap refund erc20", async accounts => {
    const initiator = accounts[0]
    const participant = accounts[1]

    const amount = (new BigNumber("10")).pow(18)
    let timeLock

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

        timeLock = parseInt(Date.now() / 1000) + 2
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

    it('wait until Atomic Swap expired', async function() {
        this.timeout(3_500)
        await delay(3_000)
    })

    it('redeem', async () => {
        const balanceBeforeSwap = await erc20TokenContract.balanceOf(initiator)

        // redeem Atomic Swap
        await atomicSwapContract.refund(
            secretHash,
            { from: initiator }
        )

        const balanceAfterSwap = await erc20TokenContract.balanceOf(initiator)
        
        expect(balanceBeforeSwap.toString()).to.be.equal("99000000000000000000")
        expect(balanceAfterSwap.toString()).to.be.equal("100000000000000000000")

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

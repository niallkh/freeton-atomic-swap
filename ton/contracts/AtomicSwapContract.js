//
// This file was generated using TON Labs developer tools.
//

const abi = {
	"ABI version": 2,
	"header": ["time", "expire"],
	"functions": [
		{
			"name": "constructor",
			"inputs": [
				{"name":"_initiator","type":"address"},
				{"name":"_participant","type":"address"},
				{"name":"_amount","type":"uint128"},
				{"name":"_timeLock","type":"uint32"}
			],
			"outputs": [
			]
		},
		{
			"name": "redeem",
			"inputs": [
				{"name":"secret","type":"bytes"}
			],
			"outputs": [
			]
		},
		{
			"name": "refund",
			"inputs": [
			],
			"outputs": [
			]
		},
		{
			"name": "params",
			"inputs": [
			],
			"outputs": [
				{"name":"_initiator","type":"address"},
				{"name":"_participant","type":"address"},
				{"name":"_timeLock","type":"uint32"},
				{"name":"_now","type":"uint32"},
				{"name":"_secretHash","type":"uint256"},
				{"name":"_amount","type":"uint128"},
				{"name":"_balance","type":"uint256"}
			]
		},
		{
			"name": "hashSecret",
			"inputs": [
				{"name":"secret","type":"bytes"}
			],
			"outputs": [
				{"name":"value0","type":"uint256"}
			]
		}
	],
	"data": [
		{"key":1,"name":"secretHash","type":"uint256"}
	],
	"events": [
		{
			"name": "Redeemed",
			"inputs": [
				{"name":"secret","type":"bytes"}
			],
			"outputs": [
			]
		}
	]
};

const pkg = {
    abi,
    imageBase64: 'te6ccgECHQEABV0AAgE0AwEBAcACAEPQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAib/APSkICLAAZL0oOGK7VNYMPShCgQBCvSkIPShBQIJngAAAAYHBgBTTtRNDT/9M/0wDV03/XC//4bvht+kD6QNcLH/hs+Gv4an/4Yfhm+GP4YoAgEgCQgAVT4QsjL//hDzws/+EbPCwDI+E34TgLLf8v/+Er4S/hMXjDPEc7Oyx/J7VSAADwg0PkCtf8xgAgEgDgsBsv9/jQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE+Gkh7UTQINdJwgGOJtP/0z/TANXTf9cL//hu+G36QPpA1wsf+Gz4a/hqf/hh+Gb4Y/hiDAH+jnn0BY0IYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABPhqjQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE+Gtw+Gxw+G1xIYBA9A6T1wv/kXDi+G5wAYBA9A7yvdcL//hicPhjcPhmf/hh4tMAAQ0Asp+BAgDXGCD5AVj4QvkQ8qje0z8Bjh74QyG5IJ8wIPgjgQPoqIIIG3dAoLnekvhj4IA08jTY0x8B+CO88rnTHyHBAyKCEP////28sZLyPOAB8AH4R26S8jzeAgEgFQ8CASAREADzurzT28+EFukvAG3tTR+CP4TLny4GX4S/hJIccF8uBmIfAEIPhOuvLgbMiL3AAAAAAAAAAAAAAAACDPFs+Bz4HPkHhY5w4jzxTJcfsA+EvIz4UIzo0DyA+gAAAAAAAAAAAAAAAAAc8Wz4HPgcmBAKD7ADAwMPAFf/hngBD7u0C2OfhBboEgH8joDe+Ebyc3H4ZvpA+kGV1NHQ+kDf1w1/ldTR0NN/39cNH5XU0dDTH9/RIPgjvCCbMCD4I4IICTqAoLne8uBo+EmNCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATHBZL4AN4j+Goi+Gsh+G0g+GxfBPAFf/hnEwFg7UTQINdJwgGOJtP/0z/TANXTf9cL//hu+G36QPpA1wsf+Gz4a/hqf/hh+Gb4Y/hiFAD4jnn0BY0IYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABPhqjQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE+Gtw+Gxw+G1xIYBA9A6T1wv/kXDi+G5wAYBA9A7yvdcL//hicPhjcPhmf/hh4gIBIBkWAgEgGBcAk7k0Ql6fCC3SXgDb2j8EfwmX3lwM3wlfCSQ44L5cDN8JWRnwoRnRoHkB9AAAAAAAAAAAAAAAAAA54tnwOfA5MCAUH2AGHgCv/wzwAIG4sTXimpokGh8gVr/mJDgf8cRkehpgP0gGBjkZ8OQZ0AwZ6BnwOfA58lLE14pEOeF/+S4/YBvGGB/yXgC7z/8M8AIBYhwaAeu1NWqz/CC3SXgDb2jGhDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJGhDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI4ODg4OHwlG/wlm3wmGvwnGfwmmXwTt4gY/BHaj5oT4H/AGwCWjj0p0NMB+kAwMcjPhyDOgGDPQM+Bz4PIz5IZq1WeKM8WJ88WJs8LHyXPCx8kzwv/yCTPC38jzwv/zc3JcfsA3l8HwP+S8AXef/hnAHLacCLQ1gIx0gD6QDD4adwhxwCQ4CHXDR+S8jzhUxGQ4cEDIoIQ/////byxkvI84AHwAfhHbpLyPN4=',
};

class AtomicSwapContract {
    /**
    * @param {TONClient} client
    * @param {string} address can be null if contract will be deployed
    * @param {TONKeyPairData} keys
    */
    constructor(client, address, keys) {
        this.client = client;
        this.address = address;
        this.keys = keys;
        this.package = pkg;
        this.abi = abi;
    }

    /**
     * @param {object} constructorParams
     * @param {string} constructorParams._initiator (address)
     * @param {string} constructorParams._participant (address)
     * @param {uint128} constructorParams._amount
     * @param {number} constructorParams._timeLock (uint32)
     * @param {object} initParams
     * @param {string} initParams.secretHash (uint256)
     */
    async deploy(constructorParams, initParams) {
        if (!this.keys) {
            this.keys = await this.client.crypto.ed25519Keypair();
        }
        this.address = (await this.client.contracts.deploy({
            package: pkg,
            constructorParams,
            initParams,
            keyPair: this.keys,
        })).address;
    }

    /**
    * @param {string} functionName
    * @param {object} input
    * @return {Promise.<object>}
    */
    async run(functionName, input) {
        const result = await this.client.contracts.run({
            address: this.address,
            functionName,
            abi,
            input,
            keyPair: this.keys,
        });
        return result.output;
    }

   /**
    * @param {string} functionName
    * @param {object} input
    * @return {Promise.<object>}
    */
    async runLocal(functionName, input) {
        const result = await this.client.contracts.runLocal({
            address: this.address,
            functionName,
            abi,
            input,
            keyPair: this.keys,
        });
        return result.output;
    }

    /**
     * @param {object} params
     * @param {bytes} params.secret
     */
    redeem(params) {
        return this.run('redeem', params);
    }

    /**
     * @param {object} params
     * @param {bytes} params.secret
     */
    redeemLocal(params) {
        return this.runLocal('redeem', params);
    }

    /**
     */
    refund() {
        return this.run('refund', {});
    }

    /**
     */
    refundLocal() {
        return this.runLocal('refund', {});
    }

    /**
     * @typedef AtomicSwapContract_params
     * @type {object}
     * @property {string} _initiator  (address)
     * @property {string} _participant  (address)
     * @property {number} _timeLock  (uint32)
     * @property {number} _now  (uint32)
     * @property {string} _secretHash  (uint256)
     * @property {uint128} _amount 
     * @property {string} _balance  (uint256)
     */

    /**
     * @return {Promise.<AtomicSwapContract_params>}
     */
    params() {
        return this.run('params', {});
    }

    /**
     * @return {Promise.<AtomicSwapContract_params>}
     */
    paramsLocal() {
        return this.runLocal('params', {});
    }

    /**
     * @typedef AtomicSwapContract_hashSecret
     * @type {object}
     * @property {string} value0  (uint256)
     */

    /**
     * @param {object} params
     * @param {bytes} params.secret
     * @return {Promise.<AtomicSwapContract_hashSecret>}
     */
    hashSecret(params) {
        return this.run('hashSecret', params);
    }

    /**
     * @param {object} params
     * @param {bytes} params.secret
     * @return {Promise.<AtomicSwapContract_hashSecret>}
     */
    hashSecretLocal(params) {
        return this.runLocal('hashSecret', params);
    }

}

AtomicSwapContract.package = pkg;

module.exports = AtomicSwapContract;

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
				{"name":"_participant","type":"address"},
				{"name":"_amount","type":"uint128"},
				{"name":"_time","type":"uint32"}
			],
			"outputs": [
			]
		},
		{
			"name": "redeem",
			"inputs": [
				{"name":"secret","type":"uint256"}
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
			"name": "destruct",
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
				{"name":"_owner","type":"address"},
				{"name":"_participant","type":"address"},
				{"name":"_expiredTime","type":"uint32"},
				{"name":"_secretHash","type":"uint256"},
				{"name":"_amount","type":"uint128"},
				{"name":"_balance","type":"uint256"},
				{"name":"_redeemed","type":"bool"},
				{"name":"_refunded","type":"bool"}
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
				{"name":"secret","type":"uint256"},
				{"name":"addr","type":"address"},
				{"name":"time","type":"uint256"}
			],
			"outputs": [
			]
		},
		{
			"name": "Refunded",
			"inputs": [
				{"name":"addr","type":"address"},
				{"name":"time","type":"uint256"}
			],
			"outputs": [
			]
		}
	]
};

const pkg = {
    abi,
    imageBase64: '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',
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
     * @param {string} constructorParams._participant (address)
     * @param {uint128} constructorParams._amount
     * @param {number} constructorParams._time (uint32)
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
     * @param {string} params.secret (uint256)
     */
    redeem(params) {
        return this.run('redeem', params);
    }

    /**
     * @param {object} params
     * @param {string} params.secret (uint256)
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
     */
    destruct() {
        return this.run('destruct', {});
    }

    /**
     */
    destructLocal() {
        return this.runLocal('destruct', {});
    }

    /**
     * @typedef AtomicSwapContract_params
     * @type {object}
     * @property {string} _owner  (address)
     * @property {string} _participant  (address)
     * @property {number} _expiredTime  (uint32)
     * @property {string} _secretHash  (uint256)
     * @property {uint128} _amount 
     * @property {string} _balance  (uint256)
     * @property {bool} _redeemed 
     * @property {bool} _refunded 
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

}

AtomicSwapContract.package = pkg;

module.exports = AtomicSwapContract;

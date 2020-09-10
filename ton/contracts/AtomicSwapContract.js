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
				{"name":"timeLock","type":"uint32"}
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
				{"name":"secret","type":"bytes"},
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
     * @param {number} constructorParams.timeLock (uint32)
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

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
				{"name":"_balance","type":"uint256"}
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

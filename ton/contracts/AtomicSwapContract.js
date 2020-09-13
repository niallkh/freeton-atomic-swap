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
				{"name":"_secretHash","type":"uint256"},
				{"name":"_amount","type":"uint128"},
				{"name":"_balance","type":"uint256"}
			]
		},
		{
			"name": "canRedeen",
			"inputs": [
				{"name":"secret","type":"bytes"}
			],
			"outputs": [
				{"name":"value0","type":"bool"}
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
     * @typedef AtomicSwapContract_canRedeen
     * @type {object}
     * @property {bool} value0 
     */

    /**
     * @param {object} params
     * @param {bytes} params.secret
     * @return {Promise.<AtomicSwapContract_canRedeen>}
     */
    canRedeen(params) {
        return this.run('canRedeen', params);
    }

    /**
     * @param {object} params
     * @param {bytes} params.secret
     * @return {Promise.<AtomicSwapContract_canRedeen>}
     */
    canRedeenLocal(params) {
        return this.runLocal('canRedeen', params);
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

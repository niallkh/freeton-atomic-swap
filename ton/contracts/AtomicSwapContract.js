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

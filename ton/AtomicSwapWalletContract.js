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
				{"name":"_codeAtomicSwap","type":"cell"}
			],
			"outputs": [
			]
		},
		{
			"name": "createSwap",
			"inputs": [
				{"name":"participant","type":"address"},
				{"name":"amount","type":"uint128"},
				{"name":"time","type":"uint32"},
				{"name":"data","type":"cell"}
			],
			"outputs": [
				{"name":"value0","type":"address"}
			]
		},
		{
			"name": "redeem",
			"inputs": [
				{"name":"secret","type":"uint256"},
				{"name":"secretHash","type":"uint256"}
			],
			"outputs": [
			]
		},
		{
			"name": "refund",
			"inputs": [
				{"name":"secretHash","type":"uint256"}
			],
			"outputs": [
			]
		},
		{
			"name": "onRedeem",
			"inputs": [
				{"name":"secretHash","type":"uint256"}
			],
			"outputs": [
			]
		},
		{
			"name": "onRefund",
			"inputs": [
				{"name":"secretHash","type":"uint256"}
			],
			"outputs": [
			]
		},
		{
			"name": "onInitiate",
			"inputs": [
				{"name":"secretHash","type":"uint256"}
			],
			"outputs": [
			]
		},
		{
			"name": "onParticipate",
			"inputs": [
				{"name":"secretHash","type":"uint256"}
			],
			"outputs": [
			]
		}
	],
	"data": [
	],
	"events": [
		{
			"name": "OnParticipate",
			"inputs": [
				{"name":"secretHash","type":"uint256"},
				{"name":"atomicSwap","type":"address"}
			],
			"outputs": [
			]
		},
		{
			"name": "OnInitiate",
			"inputs": [
				{"name":"secretHash","type":"uint256"},
				{"name":"atomicSwap","type":"address"}
			],
			"outputs": [
			]
		},
		{
			"name": "OnRedeemed",
			"inputs": [
				{"name":"secretHash","type":"uint256"},
				{"name":"amount","type":"uint256"}
			],
			"outputs": [
			]
		},
		{
			"name": "OnRefunded",
			"inputs": [
				{"name":"secretHash","type":"uint256"},
				{"name":"amount","type":"uint256"}
			],
			"outputs": [
			]
		},
		{
			"name": "Error",
			"inputs": [
				{"name":"code","type":"uint32"}
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

class AtomicSwapWalletContract {
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
     * @param {cell} constructorParams._codeAtomicSwap
     */
    async deploy(constructorParams) {
        if (!this.keys) {
            this.keys = await this.client.crypto.ed25519Keypair();
        }
        this.address = (await this.client.contracts.deploy({
            package: pkg,
            constructorParams,
            initParams: {},
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
     * @typedef AtomicSwapWalletContract_createSwap
     * @type {object}
     * @property {string} value0  (address)
     */

    /**
     * @param {object} params
     * @param {string} params.participant (address)
     * @param {uint128} params.amount
     * @param {number} params.time (uint32)
     * @param {cell} params.data
     * @return {Promise.<AtomicSwapWalletContract_createSwap>}
     */
    createSwap(params) {
        return this.run('createSwap', params);
    }

    /**
     * @param {object} params
     * @param {string} params.participant (address)
     * @param {uint128} params.amount
     * @param {number} params.time (uint32)
     * @param {cell} params.data
     * @return {Promise.<AtomicSwapWalletContract_createSwap>}
     */
    createSwapLocal(params) {
        return this.runLocal('createSwap', params);
    }

    /**
     * @param {object} params
     * @param {string} params.secret (uint256)
     * @param {string} params.secretHash (uint256)
     */
    redeem(params) {
        return this.run('redeem', params);
    }

    /**
     * @param {object} params
     * @param {string} params.secret (uint256)
     * @param {string} params.secretHash (uint256)
     */
    redeemLocal(params) {
        return this.runLocal('redeem', params);
    }

    /**
     * @param {object} params
     * @param {string} params.secretHash (uint256)
     */
    refund(params) {
        return this.run('refund', params);
    }

    /**
     * @param {object} params
     * @param {string} params.secretHash (uint256)
     */
    refundLocal(params) {
        return this.runLocal('refund', params);
    }

    /**
     * @param {object} params
     * @param {string} params.secretHash (uint256)
     */
    onRedeem(params) {
        return this.run('onRedeem', params);
    }

    /**
     * @param {object} params
     * @param {string} params.secretHash (uint256)
     */
    onRedeemLocal(params) {
        return this.runLocal('onRedeem', params);
    }

    /**
     * @param {object} params
     * @param {string} params.secretHash (uint256)
     */
    onRefund(params) {
        return this.run('onRefund', params);
    }

    /**
     * @param {object} params
     * @param {string} params.secretHash (uint256)
     */
    onRefundLocal(params) {
        return this.runLocal('onRefund', params);
    }

    /**
     * @param {object} params
     * @param {string} params.secretHash (uint256)
     */
    onInitiate(params) {
        return this.run('onInitiate', params);
    }

    /**
     * @param {object} params
     * @param {string} params.secretHash (uint256)
     */
    onInitiateLocal(params) {
        return this.runLocal('onInitiate', params);
    }

    /**
     * @param {object} params
     * @param {string} params.secretHash (uint256)
     */
    onParticipate(params) {
        return this.run('onParticipate', params);
    }

    /**
     * @param {object} params
     * @param {string} params.secretHash (uint256)
     */
    onParticipateLocal(params) {
        return this.runLocal('onParticipate', params);
    }

}

AtomicSwapWalletContract.package = pkg;

module.exports = AtomicSwapWalletContract;

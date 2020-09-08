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
			],
			"outputs": [
			]
		},
		{
			"name": "createSwap",
			"inputs": [
				{"name":"participant","type":"address"},
				{"name":"amount","type":"uint128"},
				{"name":"time","type":"uint256"},
				{"name":"data","type":"cell"}
			],
			"outputs": [
				{"name":"value0","type":"address"}
			]
		},
		{
			"name": "getAtomicSwaps",
			"inputs": [
			],
			"outputs": [
				{"name":"value0","type":"address[]"}
			]
		}
	],
	"data": [
	],
	"events": [
	]
};

const pkg = {
    abi,
    imageBase64: 'te6ccgECFAEAAycAAgE0AwEBAcACAEPQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAib/APSkICLAAZL0oOGK7VNYMPShCAQBCvSkIPShBQIDzsAHBgA712omhp/+mf6YBqaY/6AreBfDX8NT/8MPwzfDH8MUAD/3whZGX//CHnhZ/8I2eFgHwlfCW3kS8QZmWP+gBk9qpAIBIAsJAc7/fyHtRNAg10nCAY4a0//TP9MA1NMf9AVvAvhr+Gp/+GH4Zvhj+GKOIvQFyMn4anBtbwL4a3ABgED0DvK91wv/+GJw+GNw+GZ/+GHi0wABjhKBAgDXGCD5AVj4QiD4ZfkQ8qje0z8BCgCKjh74QyG5IJ8wIPgjgQPoqIIIG3dAoLnekvhj4IA08jTY0x8B+CO88rnTHyHBAyKCEP////28sZLyPOAB8AH4R26S8jzeAgEgDwwCASAODQDTuotV8/+EFujkntRNAg10nCAY4a0//TP9MA1NMf9AVvAvhr+Gp/+GH4Zvhj+GKOIvQFyMn4anBtbwL4a3ABgED0DvK91wv/+GJw+GNw+GZ/+GHi3vhG8nNx+GbR+ELDAPLgZPgA8AN/+GeACLup/dC5+EFukvAE3tH4SyHA/44nI9DTAfpAMDHIz4cgzoBgz0DPgc+Bz5Mn90LmIW8iAssf9ADJcfsA3jDA/5LwA95/+GeAIBIBMQAQm7Ei9reBEB+PhBbpLwBN76QNcNf5XU0dDTf9/XDf+V1NHQ0//f1NH4RSBukjBw3vhCuvLgZPgA+CdvECO+8uGQ+EohyHLPQHHPQSLPFHHPQSHPFHHPQCDJA18DICD5AIEEAMjLCiHPC//J0DElIcjPhYjOAfoCgGnPQM+Dz4MizxTPg8gSALTPkLLt17oozxYnzwt/Js8L/83JcfsAMfhLIQFvIiGkA1mAIPQWbwL4azElwP+OIifQ0wH6QDAxyM+HIM6AYM9Az4HPgc+SxIva3iHPFslx+wDeMF8E8AN/+GcAat1wItDWAjHSADDcIccAkOAh1w0fkvI84VMRkOHBAyKCEP////28sZLyPOAB8AH4R26S8jze',
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
     */
    async deploy() {
        if (!this.keys) {
            this.keys = await this.client.crypto.ed25519Keypair();
        }
        this.address = (await this.client.contracts.deploy({
            package: pkg,
            constructorParams: {},
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
     * @param {string} params.time (uint256)
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
     * @param {string} params.time (uint256)
     * @param {cell} params.data
     * @return {Promise.<AtomicSwapWalletContract_createSwap>}
     */
    createSwapLocal(params) {
        return this.runLocal('createSwap', params);
    }

    /**
     * @typedef AtomicSwapWalletContract_getAtomicSwaps
     * @type {object}
     * @property {string[]} value0  (address[])
     */

    /**
     * @return {Promise.<AtomicSwapWalletContract_getAtomicSwaps>}
     */
    getAtomicSwaps() {
        return this.run('getAtomicSwaps', {});
    }

    /**
     * @return {Promise.<AtomicSwapWalletContract_getAtomicSwaps>}
     */
    getAtomicSwapsLocal() {
        return this.runLocal('getAtomicSwaps', {});
    }

}

AtomicSwapWalletContract.package = pkg;

module.exports = AtomicSwapWalletContract;

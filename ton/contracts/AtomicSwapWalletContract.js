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
			"name": "sendTransaction",
			"inputs": [
				{"name":"dest","type":"address"},
				{"name":"value","type":"uint128"},
				{"name":"bounce","type":"bool"},
				{"name":"flag","type":"uint8"},
				{"name":"payload","type":"cell"}
			],
			"outputs": [
			]
		},
		{
			"name": "acceptTransfer",
			"inputs": [
				{"name":"payload","type":"bytes"}
			],
			"outputs": [
			]
		},
		{
			"name": "createSwap",
			"inputs": [
				{"name":"initiator","type":"address"},
				{"name":"participant","type":"address"},
				{"name":"amount","type":"uint128"},
				{"name":"timeLock","type":"uint32"},
				{"name":"data","type":"cell"}
			],
			"outputs": [
				{"name":"value0","type":"address"}
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
	],
	"events": [
		{
			"name": "TransferAccepted",
			"inputs": [
				{"name":"payload","type":"bytes"}
			],
			"outputs": [
			]
		}
	]
};

const pkg = {
    abi,
    imageBase64: 'te6ccgECGQEABE0AAgE0AwEBAcACAEPQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAib/APSkICLAAZL0oOGK7VNYMPShCAQBCvSkIPShBQIJngAAAAYHBgAtTtRNDT/9M/0wDXTPhqf/hh+Gb4Y/higALV+ELIy//4Q88LP/hGzwsA+EoBzMntVIAgEgDAkBAv8KAf5/jQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE+Gkh7UTQINdJwgGOE9P/0z/TANdM+Gp/+GH4Zvhj+GKOHPQFyMn4anABgED0DvK91wv/+GJw+GNw+GZ/+GHi0wABjhKBAgDXGCD5AVj4QiD4ZfkQ8qje0z8BCwCKjh74QyG5IJ8wIPgjgQPoqIIIG3dAoLnekvhj4IA08jTY0x8B+CO88rnTHyHBAyKCEP////28sZLyPOAB8AH4R26S8jzeAgEgFA0CASARDgGZutCQYM+EFukvAG3vpA+kGV1NHQ+kDf1w1/ldTR0NN/39cNH5XU0dDTH9/U0fhFIG6SMHDe+EK6jhP4APgnbxAjggiYloCgtX++8uBugPAfyOSfhJjQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAExwWzjhlwaKb7YJVopv5gMd8jggiYloCgtX++8uBuk/LAa+LiIfgjvCCbMCH4I4IICTqAoLne8uBo+EohyHLPQHHPQSLPFHHPQSHPFHHPQCDJA18DICAQAPT5AIEEAMjLCiHPC//J0DElggiYloCgtX8hyM+FiM4B+gKAac9Az4PPgyLPFM+DyM+RbQLY5inPFijPFifPC38mzwsfzclx+wAxBl8GIcD/jiIj0NMB+kAwMcjPhyDOgGDPQM+Bz4HPk7QkGDIhzxbJcfsA3jDwBX/4ZwIBIBMSAJW5TIGenwgt0l4A29qaORF7gAAAAAAAAAAAAAAABBni2fA58DnyPrlOZEQ54pkuP2AfCTkZ8LEZ0A256BnwOfA5MAgfYAYeAK//DPAAx7mdzI2fCC3SXgDb30ga4a/yupo6Gm/7+uGAErqaOhpAG/rhoPK6mjoaYPv6mj8IpA3SRg4b3whXXlwNnwAEZKSZGfCwGUAOeegZwD9AUA056BnwOfBkOeKZJF9gC+C+AK//DPACASAWFQCBulia8U1NEg0PkCtf8xIcD/jiMj0NMB+kAwMcjPhyDOgGDPQM+Bz4HPkpYmvFIhzwv/yXH7AN4wwP+S8AXef/hngCASAYFwC1uZFdI38ILdHHnaiaBBrpOEAxwnp/+mf6YBrpnw1P/ww/DN8MfwxRw56AuRk/DU4AMAgegd5XuuF//wxOHwxuHwzP/ww8W98I3k5uPwzamj8ABB8NRh4Ar/8M8ABy3HAi0NYCMdIA+kAw+GncIccAkOAh1w0fkvI84VMRkOHBAyKCEP////28sZLyPOAB8AH4R26S8jze',
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
     * @param {object} params
     * @param {string} params.dest (address)
     * @param {uint128} params.value
     * @param {bool} params.bounce
     * @param {number} params.flag (uint8)
     * @param {cell} params.payload
     */
    sendTransaction(params) {
        return this.run('sendTransaction', params);
    }

    /**
     * @param {object} params
     * @param {string} params.dest (address)
     * @param {uint128} params.value
     * @param {bool} params.bounce
     * @param {number} params.flag (uint8)
     * @param {cell} params.payload
     */
    sendTransactionLocal(params) {
        return this.runLocal('sendTransaction', params);
    }

    /**
     * @param {object} params
     * @param {bytes} params.payload
     */
    acceptTransfer(params) {
        return this.run('acceptTransfer', params);
    }

    /**
     * @param {object} params
     * @param {bytes} params.payload
     */
    acceptTransferLocal(params) {
        return this.runLocal('acceptTransfer', params);
    }

    /**
     * @typedef AtomicSwapWalletContract_createSwap
     * @type {object}
     * @property {string} value0  (address)
     */

    /**
     * @param {object} params
     * @param {string} params.initiator (address)
     * @param {string} params.participant (address)
     * @param {uint128} params.amount
     * @param {number} params.timeLock (uint32)
     * @param {cell} params.data
     * @return {Promise.<AtomicSwapWalletContract_createSwap>}
     */
    createSwap(params) {
        return this.run('createSwap', params);
    }

    /**
     * @param {object} params
     * @param {string} params.initiator (address)
     * @param {string} params.participant (address)
     * @param {uint128} params.amount
     * @param {number} params.timeLock (uint32)
     * @param {cell} params.data
     * @return {Promise.<AtomicSwapWalletContract_createSwap>}
     */
    createSwapLocal(params) {
        return this.runLocal('createSwap', params);
    }

    /**
     * @typedef AtomicSwapWalletContract_hashSecret
     * @type {object}
     * @property {string} value0  (uint256)
     */

    /**
     * @param {object} params
     * @param {bytes} params.secret
     * @return {Promise.<AtomicSwapWalletContract_hashSecret>}
     */
    hashSecret(params) {
        return this.run('hashSecret', params);
    }

    /**
     * @param {object} params
     * @param {bytes} params.secret
     * @return {Promise.<AtomicSwapWalletContract_hashSecret>}
     */
    hashSecretLocal(params) {
        return this.runLocal('hashSecret', params);
    }

}

AtomicSwapWalletContract.package = pkg;

module.exports = AtomicSwapWalletContract;

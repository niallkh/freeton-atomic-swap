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
				{"name":"value0","type":"address"},
				{"name":"value1","type":"cell"}
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
    imageBase64: 'te6ccgECGQEABFEAAgE0AwEBAcACAEPQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAib/APSkICLAAZL0oOGK7VNYMPShCAQBCvSkIPShBQIJngAAAAYHBgAtTtRNDT/9M/0wDXTPhqf/hh+Gb4Y/higALV+ELIy//4Q88LP/hGzwsA+EoBzMntVIAgEgDAkBAv8KAf5/jQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE+Gkh7UTQINdJwgGOE9P/0z/TANdM+Gp/+GH4Zvhj+GKOHPQFyMn4anABgED0DvK91wv/+GJw+GNw+GZ/+GHi0wABjhKBAgDXGCD5AVj4QiD4ZfkQ8qje0z8BCwCKjh74QyG5IJ8wIPgjgQPoqIIIG3dAoLnekvhj4IA08jTY0x8B+CO88rnTHyHBAyKCEP////28sZLyPOAB8AH4R26S8jzeAgEgEA0CAUgPDgCVuUyBnp8ILdJeANvamjkRe4AAAAAAAAAAAAAAAAQZ4tnwOfA58j65TmREOeKZLj9gHwk5GfCxGdANuegZ8DnwOTAIH2AGHgCv/wzwAMe5ncyNnwgt0l4A299IGuGv8rqaOhpv+/rhgBK6mjoaQBv64aDyupo6GmD7+po/CKQN0kYOG98IV15cDZ8ABGSkmRnwsBlADnnoGcA/QFANOegZ8DnwZDnimSRfYAvgvgCv/wzwAgEgFhECAUgVEgGZtkOB6j4QW6S8Abe+kD6QZXU0dD6QN/XDX+V1NHQ03/f1w0fldTR0NMf39TR+EUgbpIwcN74QrqOE/gA+CdvECOCCTEtAKC1f77y4G6ATAfyOSfhJjQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAExwWzjhlwaKb7YJVopv5gMd8jggkxLQCgtX++8uBuk/LAa+LiIfgjvCCbMCH4I4IICTqAoLne8uBo+EohyHLPQHHPQSLPFHHPQSHPFHHPQCDJA18DICAUAPz5AIEEAMjLCiHPC//J0DElggkxLQCgtX8hyM+FiM4B+gKAac9Az4PPgyLPFM+DyM+RbQLY5inPFijPFifPC38mzwsfzclx+wAxICNsciLA/44lJNDTAfpAMDHIz4cgzoBgz0DPgc+Bz5KkOB6iIs8WIc8UyXH7AN5b8AV/+GcAgbdia8U1NEg0PkCtf8xIcD/jiMj0NMB+kAwMcjPhyDOgGDPQM+Bz4HPkpYmvFIhzwv/yXH7AN4wwP+S8AXef/hngAgEgGBcAtbmRXSN/CC3Rx52omgQa6ThAMcJ6f/pn+mAa6Z8NT/8MPwzfDH8MUcOegLkZPw1OADAIHoHeV7rhf/8MTh8Mbh8Mz/8MPFvfCN5Obj8M2po/AAQfDUYeAK//DPAActxwItDWAjHSAPpAMPhp3CHHAJDgIdcNH5LyPOFTEZDhwQMighD////9vLGS8jzgAfAB+EdukvI83g==',
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
     * @property {cell} value1 
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

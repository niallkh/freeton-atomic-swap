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
				{"name":"flags","type":"uint8"},
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
    imageBase64: 'te6ccgECFwEAA/oAAgE0AwEBAcACAEPQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAib/APSkICLAAZL0oOGK7VNYMPShCAQBCvSkIPShBQIJnwAAAAUHBgAtO1E0NP/0z/TANdM+Gp/+GH4Zvhj+GKAALT4QsjL//hDzws/+EbPCwD4SgHMye1UgAgEgDAkBAv8KAf5/jQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE+Gkh7UTQINdJwgGOE9P/0z/TANdM+Gp/+GH4Zvhj+GKOHPQFyMn4anABgED0DvK91wv/+GJw+GNw+GZ/+GHi0wABjhKBAgDXGCD5AVj4QiD4ZfkQ8qje0z8BCwCKjh74QyG5IJ8wIPgjgQPoqIIIG3dAoLnekvhj4IA08jTY0x8B+CO88rnTHyHBAyKCEP////28sZLyPOAB8AH4R26S8jzeAgEgFA0CASARDgHlutCQYM+EFukvAF3vpA+kGV1NHQ+kDf1w1/ldTR0NN/39cNH5XU0dDTH9/U0fhFIG6SMHDe+EK6IJgw+EmLAscFs9/y4GskiwLHBbPy4GcjiwLHBbPy4Gch+CO8IJswIfgjgggJOoCgud7y4Gj4SYsCxwWA8B+I4R+CdvECOCCJiWgKC1f77y4G6OGXBopvtglWim/mAx3yOCCJiWgKC1f77y4G7i+EohyHLPQHHPQSLPFHHPQSHPFHHPQCDJA18DICD5AIEEAMjLCiHPC//J0DElghA7msoAoLV/IcjPhYjOAfoCgGnPQM+Dz4MizxTPg8gQAJbPkW0C2OYpzxYozxYnzwt/Js8LH83JcfsAMQZfBiHA/44iI9DTAfpAMDHIz4cgzoBgz0DPgc+Bz5O0JBgyIc8WyXH7AN4w8AR/+GcCASATEgCVuUyBnp8ILdJeALvamjkRe4AAAAAAAAAAAAAAAAQZ4tnwOfA58j65TmREOeKZLj9gHwk5GfCxGdANuegZ8DnwOTAIH2AGHgCP/wzwAMe5ncyNnwgt0l4Au99IGuGv8rqaOhpv+/rhgBK6mjoaQBv64aDyupo6GmD7+po/CKQN0kYOG98IV15cDZ8ABGSkmRnwsBlADnnoGcA/QFANOegZ8DnwZDnimSRfYAvgvgCP/wzwAgFIFhUAtbmRXSN/CC3Rx52omgQa6ThAMcJ6f/pn+mAa6Z8NT/8MPwzfDH8MUcOegLkZPw1OADAIHoHeV7rhf/8MTh8Mbh8Mz/8MPFvfCN5Obj8M2po/AAQfDUYeAI//DPAActxwItDWAjHSAPpAMPhp3CHHAJDgIdcNH5LyPOFTEZDhwQMighD////9vLGS8jzgAfAB+EdukvI83g==',
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
     * @param {number} params.flags (uint8)
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
     * @param {number} params.flags (uint8)
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

}

AtomicSwapWalletContract.package = pkg;

module.exports = AtomicSwapWalletContract;

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
    imageBase64: 'te6ccgECGQEAA8gAAgE0AwEBAcACAEPQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAib/APSkICLAAZL0oOGK7VNYMPShCAQBCvSkIPShBQIJngAAAAYHBgAtTtRNDT/9M/0wDXTPhqf/hh+Gb4Y/higALV+ELIy//4Q88LP/hGzwsA+EoBzMntVIAgEgDAkBAv8KAf5/Ie1E0CDXScIBjhPT/9M/0wDXTPhqf/hh+Gb4Y/hijhz0BcjJ+GpwAYBA9A7yvdcL//hicPhjcPhmf/hh4tMAAY4SgQIA1xgg+QFY+EIg+GX5EPKo3tM/AY4e+EMhuSCfMCD4I4ED6KiCCBt3QKC53pL4Y+CANPI02NMfAfgjCwA+vPK50x8hwQMighD////9vLGS8jzgAfAB+EdukvI83gIBIBANAgFIDw4AbblMgZ6fCC3SXgDb2po5EXuAAAAAAAAAAAAAAAAEGeLZ8DnwOfI+uU5kRDnimS4/YAYeAK//DPAAx7mdzI2fCC3SXgDb30ga4a/yupo6Gm/7+uGAErqaOhpAG/rhoPK6mjoaYPv6mj8IpA3SRg4b3whXXlwNfwAEZKSZGfCwGUAOeegZwD9AUA056BnwOfBkOeKZJF9gC+C+AK//DPACASAWEQIBSBUSAQm2Q4HqIBMB+vhBbpLwBt76QPpBldTR0PpA39cNf5XU0dDTf9/XDR+V1NHQ0x/f1NH4RSBukjBw3vhCuvLga/gA+CdvECOCCcnDgKC1f77y4G0h+CO8IJswIfgjgggJOoCgud7y4Gj4SiHIcs9Acc9BIs8Ucc9BIc8Ucc9AIMkDXwMgIPkAFAD4gQQAyMsKIc8L/8nQMSWCCcnDgKC1fyHIz4WIzgH6AoBpz0DPg8+DIs8Uz4PIz5FtAtjmKc8WKM8WJ88LfybPCx/NyXH7ADEgI2xyIsD/jiUk0NMB+kAwMcjPhyDOgGDPQM+Bz4HPkqQ4HqIizxYhzxTJcfsA3lvwBX/4ZwCBt2JrxTU0SDQ+QK1/zEhwP+OIyPQ0wH6QDAxyM+HIM6AYM9Az4HPgc+Slia8UiHPC//JcfsA3jDA/5LwBd5/+GeACASAYFwC1uZFdI38ILdHHnaiaBBrpOEAxwnp/+mf6YBrpnw1P/ww/DN8MfwxRw56AuRk/DU4AMAgegd5XuuF//wxOHwxuHwzP/ww8W98I3k5uPwzamj8ABB8NRh4Ar/8M8ABq3HAi0NYCMdIAMNwhxwCQ4CHXDR+S8jzhUxGQ4cEDIoIQ/////byxkvI84AHwAfhHbpLyPN4=',
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

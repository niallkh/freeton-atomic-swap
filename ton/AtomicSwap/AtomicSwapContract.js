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
				{"name":"_time","type":"uint256"}
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
			"name": "params",
			"inputs": [
			],
			"outputs": [
				{"name":"_owner","type":"address"},
				{"name":"_participant","type":"address"},
				{"name":"_expired_time","type":"uint256"},
				{"name":"_secret_hash","type":"uint256"},
				{"name":"_amount","type":"uint128"},
				{"name":"_balance","type":"uint256"}
			]
		}
	],
	"data": [
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
    imageBase64: 'te6ccgECGwEABTYAAgE0AwEBAcACAEPQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAib/APSkICLAAZL0oOGK7VNYMPShCAQBCvSkIPShBQIJnwAAAAUHBgBTO1E0NP/0z/TANXT/9N/1wv/+G74bfhs+kD6QDD4a/hqf/hh+Gb4Y/higAFc+ELIy//4Q88LP/hGzwsAyPhM+E34Tl4gy//Lf8v/+Er4S14gzxHOzsntVIAIBIAwJAbL/f40IYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABPhpIe1E0CDXScIBjibT/9M/0wDV0//Tf9cL//hu+G34bPpA+kAw+Gv4an/4Yfhm+GP4YgoB5o5t9AWNCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAT4ao0IYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABPhrcPhscPhtcPhucAGAQPQO8r3XC//4YnD4Y3D4Zn/4YeLTAAELALKfgQIA1xgg+QFY+EL5EPKo3tM/AY4e+EMhuSCfMCD4I4ED6KiCCBt3QKC53pL4Y+CANPI02NMfAfgjvPK50x8hwQMighD////9vLGS8jzgAfAB+EdukvI83gIBIA8NAd+9om3yn8ILdJeALvaMaEMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkaEMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjg4ODh8JRt8JZr8Jhp8Jxn8Jpl8E7eIGJNgf8DgCOjjko0NMB+kAwMcjPhyDOgGDPQM+Bz4PIz5PRNvlOJ88WJs8WJc8L/8glzwv/JM8LfyPPC//Nzclx+wDeXwbA/5LwBN5/+GcCASAaEAIBIBYRAgEgExIA4bZohL0+EFukvAF3tH4SfhKxwXy4ZD4I/hMvvLhkMiL3AAAAAAAAAAAAAAAACDPFs+Bz4HPkW2hO1r4Ss8W+CPPC//JcfsA+ErIz4UIzo0DyA+gAAAAAAAAAAAAAAAAAc8Wz4HPgcmBAKD7APAEf/hngAQm3vjXXIBQB/vhBbpLwBd7T/9H4SfhLxwXy4ZD4I/hMufLhkPgnbxD4Tb7y4ZDIIc8L/8nQ+QK1/yD4Trry4ZD4TfhLyM+FiM4B+gKAac9Az4HPgclx+wDIi9wAAAAAAAAAAAAAAAAgzxbPgc+Bz5B61yraIs8L//hLzxb4I88L/8lx+wD4SsgVAFLPhQjOjQPID6AAAAAAAAAAAAAAAAABzxbPgc+ByYEAoPsAMDDwBH/4ZwEPuZduvd8ILdAXAd6OgN74RvJzcfhm+kDXDX+V1NHQ03/f1w3/ldTR0NP/39H4SYsCxwWz8uGQIosCxwWz8uGQIMIAIJkwIIIQEswDAbvf8uGQcGim+2CVaKb+YDHf+E2+8uGQ+Er4aiL4ayH4bfgjIaD4bF8D8AR/+GcYAWDtRNAg10nCAY4m0//TP9MA1dP/03/XC//4bvht+Gz6QPpAMPhr+Gp/+GH4Zvhj+GIZAOCObfQFjQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE+GqNCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAT4a3D4bHD4bXD4bnABgED0DvK91wv/+GJw+GNw+GZ/+GHiAHLdcCLQ1gIx0gD6QDD4adwhxwCQ4CHXDR+S8jzhUxGQ4cEDIoIQ/////byxkvI84AHwAfhHbpLyPN4=',
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
     * @param {string} constructorParams._time (uint256)
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
     * @typedef AtomicSwapContract_params
     * @type {object}
     * @property {string} _owner  (address)
     * @property {string} _participant  (address)
     * @property {string} _expired_time  (uint256)
     * @property {string} _secret_hash  (uint256)
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

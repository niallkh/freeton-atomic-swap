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
			"name": "destruct",
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
    imageBase64: 'te6ccgECJwEAB1sAAgE0AwEBAcACAEPQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAib/APSkICLAAZL0oOGK7VNYMPShCAQBCvSkIPShBQIJnwAAAAsHBgA7O1E0NP/0z/TANT0BPQF+Gz4a/hqf/hh+Gb4Y/higAD8+ELIy//4Q88LP/hGzwsA+Er4S/hMXiDM9AD0AMntVIAIBIAsJAer/f40IYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABPhpIe1E0CDXScIBjhrT/9M/0wDU9AT0Bfhs+Gv4an/4Yfhm+GP4Yo4i9AXIyfhqbfhrbfhscAGAQPQO8r3XC//4YnD4Y3D4Zn/4YeLTAAEKALqOEoECANcYIPkBWPhCIPhl+RDyqN7TPwGOHvhDIbkgnzAg+COBA+iogggbd0Cgud6S+GPggDTyNNjTHwH4I7zyudMfIcEDIoIQ/////byxkvI84AHwAfhHbpLyPN4CASAdDAIBIBYNAgEgEQ4CASAQDwDVt0YTbX4QW6S8Ave0//R+EUgbpIwcN74Qrry4GT4ACD4S4EBAPQOb6EwIG6z8uGXICBu8n9/yM+FgMoAc89Azo0EUBfXhAAAAAAAAAAAAAAAAAABzxbPgc+Bz5DmiEvSyXH7ADAw8Ap/+GeAA57efYz1+EFukvAL3tP/0SD4S4EBAPQOb6EwIG6z8uGaICBu8n/4SccF8uGb+EsiASEBgQEA9FswMfhryIvcAAAAAAAAAAAAAAAAIM8Wz4HPgc+QxrkkViLPC/9waKb7YJVopv5gMd/PC//JcfsAW/AKf/hngAgJwExIAu7FeErvwgt0l4Be9p/+j8JORnwoRnQDbnoGfA58DkwCB9gHwmEID8JKzAgIB6C3w2ZEXuAAAAAAAAAAAAAAAAEGeLZ8DnwOfIMiOc5RDnhf/8JOeLZLj9gBh4BT/8M8BB7B11Y0UAf74QW6S8Ave0//XDf+V1NHQ0//f0fhFIG6SMHDe+EK68uBk+AAg+EyBAQD0Dm+hMCBus/Lhlsgjzwv/ydD5ArX/ICO68uGdISBu8n9/yM+FgMoAc89Azo0EUBfXhAAAAAAAAAAAAAAAAAABzxbPgc+Bz5Db411yJM8L/8lx+wBbFQAMW/AKf/hnAgEgGBcA57mgm+4/CC3SXgF72n/6JB8JkCAgHoHN9CYEDdZ+XDMEBA3eT/8JOOC+XDM/CYRAJCAwICAei2YGPw2ZEXuAAAAAAAAAAAAAAAAEGeLZ8DnwOfIkIwe8RFnhf+4NFN9sEq0U38wGO/nhf/kuP2ALfgFP/wzwAgLEGhkA8a8Ddg/hBbpLwC97T/9H4RSBukjBw3vhCuvLgZPgAIPhLgQEA9A5voTAgbrPy4Zf4SyIBIQGBAQD0WzAx+GsgIG7yf3/Iz4WAygBzz0DOjQRQF9eEAAAAAAAAAAAAAAAAAAHPFs+Bz4HPkR8Yt2rJcfsAMDDwCn/4Z4BB64PY+obAf74QW6S8Ave+kDXDX+V1NHQ03/f1w0fldTR0NMf39TR+EUgbpIwcN74Qrry4GT4ACOLAscFs/LhkPgoJMcFs/LhkSHCAPLhkvgnbxAjghA7msoAoLV/vvLhlPhKIchyz0Bxz0EizxRxz0EhzxRxz0AgyQNfAyAg+QCBBADIywohHADezwv/ydAxJYIQO5rKAKC1fyHIz4WIzgH6AoBpz0DPg8+DIs8Uz4PIz5AlAnCOKM8WJ88LfybPCx/NyXH7ADExJcD/jiIn0NMB+kAwMcjPhyDOgGDPQM+Bz4HPkwAPY+ohzxbJcfsA3jBfBPAKf/hnAgEgHx4AgbpYmvFNTRIND5ArX/MSHA/44jI9DTAfpAMDHIz4cgzoBgz0DPgc+Bz5KWJrxSIc8L/8lx+wDeMMD/kvAK3n/4Z4AgEgISAA3bmRXSN/CC3RyT2omgQa6ThAMcNaf/pn+mAanoCegL8Nnw1/DU//DD8M3wx/DFHEXoC5GT8NTb8Nbb8NjgAwCB6B3le64X//DE4fDG4fDM//DDxb3wjeTm4/DNqaPwhYYB5cDJ8ABB8NRh4BT/8M8AIBSCMiAL20WOYK/CC3SXgF72n/6Pwk5GfChGdANuegZ8DnwOTAIH2AfCWQgPwkrMCAgHoLfDXkRe4AAAAAAAAAAAAAAAAQZ4tnwOfA58iIdneJEOeF//wk54tkuP2AGHgFP/wzwAEc2nAi0NYCMdIA+kAw+GkkAVqOgOAhxwCQ4CHXDR+S8jzhUxGQ4cEDIoIQ/////byxkvI84AHwAfhHbpLyPN4lAXoh1h8xcfAB8Asg0x8yIIIQOaIS9LqOJsiL3AAAAAAAAAAAAAAAACDPFs+Bz4HPkFD106KBAfTPCx/JcfsAJgC+jlkgghA2+Ndcuo4myIvcAAAAAAAAAAAAAAAAIM8Wz4HPgc+QUPXTooEB9c8LH8lx+wCOJsiL3AAAAAAAAAAAAAAAACDPFs+Bz4HPkFD106KBAfbPCx/JcfsA4uJb8Ao=',
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
    destruct(params) {
        return this.run('destruct', params);
    }

    /**
     * @param {object} params
     * @param {string} params.secretHash (uint256)
     */
    destructLocal(params) {
        return this.runLocal('destruct', params);
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

const { TONClient } = require('ton-client-node-js')

const boc = "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"

const abi = {
    "ABI version": 2,
    "header": ["pubkey", "time", "expire"],
    "functions": [
        {
            "name": "constructor",
            "inputs": [
                {"name":"owners","type":"uint256[]"},
                {"name":"reqConfirms","type":"uint8"}
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
            "name": "submitTransaction",
            "inputs": [
                {"name":"dest","type":"address"},
                {"name":"value","type":"uint128"},
                {"name":"bounce","type":"bool"},
                {"name":"allBalance","type":"bool"},
                {"name":"payload","type":"cell"}
            ],
            "outputs": [
                {"name":"transId","type":"uint64"}
            ]
        },
        {
            "name": "confirmTransaction",
            "inputs": [
                {"name":"transactionId","type":"uint64"}
            ],
            "outputs": [
            ]
        },
        {
            "name": "isConfirmed",
            "inputs": [
                {"name":"mask","type":"uint32"},
                {"name":"index","type":"uint8"}
            ],
            "outputs": [
                {"name":"confirmed","type":"bool"}
            ]
        },
        {
            "name": "getParameters",
            "inputs": [
            ],
            "outputs": [
                {"name":"maxQueuedTransactions","type":"uint8"},
                {"name":"maxCustodianCount","type":"uint8"},
                {"name":"expirationTime","type":"uint64"},
                {"name":"minValue","type":"uint128"},
                {"name":"requiredTxnConfirms","type":"uint8"},
                {"name":"requiredUpdConfirms","type":"uint8"}
            ]
        },
        {
            "name": "getTransaction",
            "inputs": [
                {"name":"transactionId","type":"uint64"}
            ],
            "outputs": [
                {"components":[{"name":"id","type":"uint64"},{"name":"confirmationsMask","type":"uint32"},{"name":"signsRequired","type":"uint8"},{"name":"signsReceived","type":"uint8"},{"name":"creator","type":"uint256"},{"name":"index","type":"uint8"},{"name":"dest","type":"address"},{"name":"value","type":"uint128"},{"name":"sendFlags","type":"uint16"},{"name":"payload","type":"cell"},{"name":"bounce","type":"bool"}],"name":"trans","type":"tuple"}
            ]
        },
        {
            "name": "getTransactions",
            "inputs": [
            ],
            "outputs": [
                {"components":[{"name":"id","type":"uint64"},{"name":"confirmationsMask","type":"uint32"},{"name":"signsRequired","type":"uint8"},{"name":"signsReceived","type":"uint8"},{"name":"creator","type":"uint256"},{"name":"index","type":"uint8"},{"name":"dest","type":"address"},{"name":"value","type":"uint128"},{"name":"sendFlags","type":"uint16"},{"name":"payload","type":"cell"},{"name":"bounce","type":"bool"}],"name":"transactions","type":"tuple[]"}
            ]
        },
        {
            "name": "getTransactionIds",
            "inputs": [
            ],
            "outputs": [
                {"name":"ids","type":"uint64[]"}
            ]
        },
        {
            "name": "getCustodians",
            "inputs": [
            ],
            "outputs": [
                {"components":[{"name":"index","type":"uint8"},{"name":"pubkey","type":"uint256"}],"name":"custodians","type":"tuple[]"}
            ]
        },
        {
            "name": "submitUpdate",
            "inputs": [
                {"name":"codeHash","type":"uint256"},
                {"name":"owners","type":"uint256[]"},
                {"name":"reqConfirms","type":"uint8"}
            ],
            "outputs": [
                {"name":"updateId","type":"uint64"}
            ]
        },
        {
            "name": "confirmUpdate",
            "inputs": [
                {"name":"updateId","type":"uint64"}
            ],
            "outputs": [
            ]
        },
        {
            "name": "executeUpdate",
            "inputs": [
                {"name":"updateId","type":"uint64"},
                {"name":"code","type":"cell"}
            ],
            "outputs": [
            ]
        },
        {
            "name": "getUpdateRequests",
            "inputs": [
            ],
            "outputs": [
                {"components":[{"name":"id","type":"uint64"},{"name":"index","type":"uint8"},{"name":"signs","type":"uint8"},{"name":"confirmationsMask","type":"uint32"},{"name":"creator","type":"uint256"},{"name":"codeHash","type":"uint256"},{"name":"custodians","type":"uint256[]"},{"name":"reqConfirms","type":"uint8"}],"name":"updates","type":"tuple[]"}
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
}



async function main() {
    try {
        const client = await TONClient.create({servers: ['http://0.0.0.0']})

        const result = await client.contracts.decodeOutputMessageBody({
            abi: abi,
            bodyBase64: boc,
            internal: false,
        })

        console.log(`${JSON.stringify(result, null, 2)}`)
    } catch(e) {
        console.log(e)
    }
}

main()

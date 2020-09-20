# Bitcoin Atomic Swap Smart Contract

### Description

Here is implementation of Hashed TimeLock Contract for Bitcoin using Script. This library doesn't interact with blockchain and don't implement wallet logic. Using this lib you can create raw transactions or calculate p2sh address of Atomic Swap. For interacting with bitcoin blockchain you should use your wallet, but I reccomend [`bitcoin-core`](https://bitcoin.org/en/bitcoin-core/).

### Source code

`./contracts/AtomicSwapContracts.js` - [Atomic Swap Smart Contract](https://github.com/nailkhaf/freeton-atomic-swap/blob/master/btc/contracts/AtomicSwapContracts.js)

### Tests

Command line interface for testing bitcoin Atomic Swap contracts on regtest. To run it you should run regtest bitcoin network and send bitcoins to Alice's and Dave's p2wpkh addresses. In this exmaple Dave want to transfer btc to Alice using Atomic Swap. Required to install [`bitcoin-core`](https://bitcoin.org/en/bitcoin-core/).

[`./test/AtomicSwapTest.js`](https://github.com/nailkhaf/freeton-atomic-swap/blob/master/btc/test/AtomicSwapTest.js)

There are 4 commands:

`node ./test/AtomicSwapTest.js create` - create p2sh address of Atomic Swap contract. Next you should send required bitcoins to this address using your bitcoin-core wallet from Dave p2wpkh address. At this step we store params, secretHash adn etc. in file `./test/db.json` to avoid passing them through cli.

`node ./test/AtomicSwapTest.js verify <p2shAddress>` - Alice must verify that p2shAdress have right params. Participant and Initiator public keys, secretHash, timeLock. 

`node ./test/AtomicSwapTest.js redeem <tx-id> <tx-vout> <tx-hex>` - to redeem Atomic Swap you need to provide params of transaction, that was send with bitcoins to p2shAddress. You can use bitcoin-core to get it. This command returns hex of transaction that you need to send using `sendrawtransaction` in bitcoin-core. After this step Atomic Swap transfer is redeemed by Alice.

`node ./test/AtomicSwapTest.js refund <tx-id> <tx-vout> <tx-hex>` - to refund Atomic Swap you need to provide params of transaction, that was send with bitcoins to p2shAddress. You can use bitcoin-core to get it. This command returns hex of transaction that you need to send using `sendrawtransaction` in bitcoin-core. After this step Atomic Swap transfer is refunded by Dave.

### Specification AtomicSwapContrcats.js

This contract implements Hashed TimeLock Contract. Lock bitcoins until lock time or redeem by secret. I've used in contract OP_CHECKLOCKTIMEVERIFY and OP_SHA256.

Creates an atomic swap contract using Bitcoin Script.

`function createAtomicSwapScript(secretHash, initiatorPubKey, participantPubKey, lockTime)`

Creates an atomic swap redeem script. Can be used together with #createAtomicSwapScript.

`function createAtomicSwapRedeemScript(signature, participantPubKey, secret)`

Creates an atomic swap redeem script. Can be used together with #createAtomicSwapScript.

`function createAtomicSwapRefundScript(signature, initiatorPubKey)`

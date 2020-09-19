# FreeTon Atomic Swap Smart Contract

### Source code

`./contracts/AtomicSwap.sol` - [Atomic Swap Smart Contract](https://github.com/nailkhaf/freeton-atomic-swap/blob/master/ton/contracts/AtomicSwap.sol)

### Commands

`npm test` - run tests. Require running [tondev](https://github.com/tonlabs/ton-dev-cli) docker instance.

`npm run build` - compile solidity smart contracts and generate js wrappers.

Requirements:
* [TON-Solidity-Compiler](https://github.com/tonlabs/TON-Solidity-Compiler/)
* [TVM-linker](https://github.com/tonlabs/TVM-linker)
* [ton-dev-cli](https://github.com/tonlabs/ton-dev-cli)

### Tests

* [`./test/AtomicSwapMultisigWalletTest.js`](https://github.com/nailkhaf/freeton-atomic-swap/blob/master/ton/test/AtomicSwapMultisigWalletTest.js)

Testing Atomic Swap case without `AtomicSwapWallet`, using only `SetcodeMultisigWallet` from Surf. Deploy Atomic Swap by external message.

* [`./test/AtomicSwapTest.js`](https://github.com/nailkhaf/freeton-atomic-swap/blob/master/ton/test/AtomicSwapTest.js)
 
Testing standard Atomic Swap case, transfering ton crystals from one `AtomicSwapWallet` and redeem by another `AtomicSwapWallet`. 

* [`./test/AtomicSwapRefundTest.js`](https://github.com/nailkhaf/freeton-atomic-swap/blob/master/ton/test/AtomicSwapRefundTest.js) 
 
Testing `refund` Atomic Swap case.

### Specification

This contract is example of Hashed TimeLock Contract. Lock ton crystals until lock time or redeem by secret. 

`contract AtomicSwap`

Constructor for creating Atomic Swap. Initiator must ptovide all required params. Constructor can be called in two ways: by external or external message. At first case, initator should send a small amount ton crystals to UNINIT account before deploying with `bounce=false`. After deploying initiator must send rest ton crystals. At second case, internal message, initiator must send required amount of ton crystals with internal deploy message.

`constructor(address initiator, address participant, uint128 amount, uint32 timeLock) public`

Redeem Atomic Swap by participant before time lock. Emit `Redeemed` event to reveal secret. Sender must be participant. Destruct contract after execution.

`function redeem(bytes secret) external;`

Refund Atomic Swap by initiator after time lock. Sender must be initiator Destruct contract after execution.

`function refund() external;`

# Ethereum Atomic Swap Smart Contract

### Source code

[`./contracts/AtomicSwap.sol`](https://github.com/nailkhaf/freeton-atomic-swap/blob/master/eth/contracts/AtomicSwap.sol) - Atomic Swap Smart Contract

### Commands

`npm test` - run tests by truffle, require running [ganache](https://www.trufflesuite.com/ganache)

`npm run build` - compile solidity smart contracts by truffle, require running [ganache](https://www.trufflesuite.com/ganache)

`npm run deploy` - run migration smart contract to development network, require running [ganache](https://www.trufflesuite.com/ganache)

`npm run deploy-ropsten` - run migration smart contract to ropsten network

### Tests

- [`./test/AtomicSwapTest.js`](https://github.com/nailkhaf/freeton-atomic-swap/blob/master/eth/test/AtomicSwapTest.js) - Testing Atomic Swap transfer native ethers from one account and redeem by another account.
- [`./test/AtomicSwapErc20Test.js`](https://github.com/nailkhaf/freeton-atomic-swap/blob/master/eth/test/AtomicSwapErc20Test.js) - Testing Atomic Swap transfer erc20 tokens from one account and redeem by another account.
- [`./test/AtomicSwapRefundTest.js`](https://github.com/nailkhaf/freeton-atomic-swap/blob/master/eth/test/AtomicSwapRefundTest.js) - 
Testing Atomic Swap refund native ether.
- [`./test/AtomicSwapRefundErc20Test.js`](https://github.com/nailkhaf/freeton-atomic-swap/blob/master/eth/test/AtomicSwapRefundErc20Test.js) - 
Testing Atomic Swap refund erc20 token.

### Specification AtomicSwap.sol

- `contract AtomicSwap` - implements Hashed TimeLock Contract. Lock native ethers or ERC20 tokens until lock time or redeem by secret. Everyone can deploy this contract or use already deployed contract by another person.
- `function createSwap(uint256 secretHash, address participant, uint256 value, uint256 timeLock) external payable` - creates Atomic Swap transfer from sender to `participant`. Lock native ether `value` until `timeLock` or redeem. `secretHash` is unique identifier for Atomic Swap. Be careful while generating secret.
- `function createSwapErc20(uint256 secretHash, address participant, uint256 alue, uint256 timeLock, address tokenAddr) external` - creates Atomic Swap transfer from sender to `participant`. Lock erc20 tokens `value` until `timeLock` or redeem. `secretHash` is unique identifier for Atomic Swap. Be careful while generating secret. `tokenAddr` is address of ERC20 compatible smart contract.
- `function redeem(bytes calldata secret) external` - redeem Atomic Swap by participant before time lock. Emit `Redeemed` event to reveal secret. Sender must be participant.
- `function refund(uint256 secretHash) external` - refund Atomic Swap by initiator after time lock. Sender must be initiator.
- `function params(uint256 secretHash) public view returns (address initiator, address participant, uint256 timeLock, uint256 currTime, uint256 value, address tokenAddr, SwapType swapType)` - fetch params of Atomic Swap to verify it.
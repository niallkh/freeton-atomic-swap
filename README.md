# Developers Contest: Atomic Swaps on Free TON

### Summary

Implementation and demonstration smart contracts of Atomic Swaps:
- **Ton Crystal**
- **Native Ether**
- **Ethereum ERC20**
- **Bitcoin**

### Author

Nail Khafizov, independent software developer.

[telegram](https://t.me/nailkhaf)

854297992c@gmail.com

### Repository structure

[`./ton`](https://github.com/nailkhaf/freeton-atomic-swap/tree/master/ton) - Atomic Swap Contracts for FreeTon blockchain

[`./eth`](https://github.com/nailkhaf/freeton-atomic-swap/tree/master/eth) - Atomic Swap Contracts for Ethereum blockchain

[`./btc`](https://github.com/nailkhaf/freeton-atomic-swap/tree/master/ton) - Atomic Swap Contracts for Bitcoin blockchain

`./app` - App for demostrating working of Smart Contracts at testnets. Not use in production, only for learning purpose

### Motivation

The goal is to develop an infrastructure that allows users to perform transactions between different blockchains without an escrow in an untrusted environment. This will make the exchange market around TON Crystal more secure for OTC transactions.

### Abstract 

An Atomic Swap is a smart contract technology that enables the exchange of one cryptocurrency for another without using centralized intermediaries, such as exchanges. I've learned two ways of swaps. First, by using Hashed Timelock Contract (HTLC). Second, using Simplified Payment Verification (SPV).

HTLC way is the most simple, it requires from blockchain supporting common hash function (for example sha256) and TimeLock contract functionality. Cons: can be fully decentralised. Pros: requires side communication between participants and locking money on specific time.

SPV way require from one of two blockchains supporting runnig complex smart contracts (for example ethreum or ton) to verify transaction's Merke Proof of transfer. Cons: transfer can be fast and automatic. Pros: need solution to identify where the transaction came from: mainnet or testnet or side blockchain by using oracles smart contracts or supporting SPV verification by validators.

I choose first way, because the time of contest is limited to three weeks and high transmission speed can be achieved through automation Atomic Swap Wallet, which supports SPV verification different blockchains off-chain.

### Requirements

* The possibility of a safe return of funds to each of the parties if the other party does not comply with the terms of the trade
* Open sources of smart contracts published at GitHub/GitLab or another open repository
* Documentation
* Name and contact information of the contestant for communication (Telegram username, e-mail)

### Tech Stack

FreeTon: TON-Solidity-Compiler, Solidity, js for testing

Ethereum: Truffle, Solidity, js for testing

Bitcoin: bitcoinjs-lib, js

### WorkFlow

![workflow image](./workflow.png)

Commands:

* initiate <participant address> <amount> <secret hash> <lock time>
* participate <initiator address> <amount> <secret hash> <lock time>
* redeem <contract> <contract transaction> <secret>
* refund <contract> <contract transaction>

Steps:

1. Part A must generate the secret limited by 32 bytes and store it securely. Next, Part A `initiate` and create contract with hash of secret and participant's address. In this contract the locktime should be doubled to avoid scam, for example 24 hours * 2 = 48 hours. After that Part A must send transaction or smart contract address to Part B. 

2. Part B must verify Part A's contract: participant's address, lockTime, amount, hash of code. If everything is right Part A must `participate` and create contract with Part A's secret hash, otherwise Part B can ignore do nothing. Part B needs to be careful, lockTime must be less Part A's lockTime at the moment of creating contract. After, Part B must send transaction or smart contract address to Part A.

3. Part A must verify Part B's contract. If everything is right Part A can `redeem` from Part A's contract and reveal secret, otherwise Part A can wait timeLock and refund his transfer. 

4. Part B should extract secret and `redeem` from Part A's contract.

The most part of steps can be automated by wallet, with the exception of exchange address and transactions.

### References

https://www.investopedia.com/terms/a/atomic-swaps.asp

https://github.com/decred/atomicswap

https://medium.com/summa-technology/cross-chain-auction-technical-f16710bfe69f

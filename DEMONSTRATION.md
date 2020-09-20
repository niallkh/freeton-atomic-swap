# Demonstration of using Atomic Swap smart contracts 

### Prerequisites 

Atomic-Swap cli interface ['./app/app.js'](https://github.com/nailkhaf/freeton-atomic-swap/tree/master/app/app.js):
* Not for production usage, only for demonstration

FreeTon:
* Testnet network
* [Testnet blockchain explorer](https://net.ton.live/)
* Wallet with ton rubins

Ethereum:
* Ropsten testnet network
* [Ropsten Etherscan](https://ropsten.etherscan.io/)
* [Infura](https://infura.io/)
* Wallet with ethers

Bitcoin:
* Testnet
* [Bitcoin testnet explorer](https://blockstream.info/testnet/)
* [Bitcoin-core](https://bitcoin.org/en/bitcoin-core/)
* Wallet with bitcoins

### Description

In this example two users participate. First user 0-Alice and second 1-Bob. Alice has ton rubins and want to buy Ether. Bob has ether and want to buy ton rubins.

In this example I will use Atomic Swap cli interface from ['./app/app.js'](https://github.com/nailkhaf/freeton-atomic-swap/tree/master/app/app.js).

Atomic Swap cli help message: 
```bash
$ node ./app/app.js -h
Usage: app [options] [command]

Options:
  -V, --version        output the version number
  -u, --user <number>  user id, can be used to specify user (default: 0)
  -h, --help           display help for command

Commands:
  ton                  command for freeton blockchain
  eth                  command for ethereum blockchain
  btc                  command for bitcoin blockchain
  reset                reset keys and wallets
  help [command]       display help for command

```

### Preparation

Need to check check users have working wallets and positive balances. Deploy wallet if need.

`-u 0` - parameter for Alice
`-u 1` - parameter for Bob

```bash
$ node ./app/app.js -u 0 ton wallet-address
Atomic Swap Wallet address:
0:290371955258087a35fdeae9fec0b5c69b310f39b90a4bf32dbfed26a5632296
```

https://net.ton.live/accounts?section=details&id=0:290371955258087a35fdeae9fec0b5c69b310f39b90a4bf32dbfed26a5632296

Send ton rubins from Surf app and deploy wallet.

```bash
$ node ./app/app.js -u 0 ton deploy-wallet
Atomic Swap Wallet deployed
```

Balance of Alice:
```bash
$ node ./app/app.js -u 0 ton balance
Atomic Swap Wallet balance:
"4_971_068_999"
```

```bash
$ node ./app/app.js -u 1 ton wallet-address
Atomic Swap Wallet address:
0:c0bee8851ee87883a84fa3093eb0db5ccc46f25e7c92eb06d53a9ef18e840d24
```

https://net.ton.live/accounts?section=details&id=0:c0bee8851ee87883a84fa3093eb0db5ccc46f25e7c92eb06d53a9ef18e840d24

Balance of Bob:
```bash
$ node ./app/app.js -u 1 ton balance
Atomic Swap Wallet balance:
"971_068_999"
```

```bash
$ node ./app/app.js -u 0 eth wallet-address
Wallet address:
0xBcb9eDA088910ACe1328185d286f1CD5f49aa649
```

https://ropsten.etherscan.io/address/0xbcb9eda088910ace1328185d286f1cd5f49aa649

```bash
$ node ./app/app.js -u 1 eth wallet-address
Wallet address:
0x3613452b0EA100724b071031B8Fe2DAb0097CEd5
```

https://ropsten.etherscan.io/address/0x3613452b0ea100724b071031b8fe2dab0097ced5

```bash
$ node ./app/app.js -u 0 eth balance
Wallet balance:
"1_999_801_590_088_213_200"
```

```bash
$ node ./app/app.js -u 1 eth balance
Wallet balance:
"1_999_293_474_225_822_500"
```

#### Summary of preparation

Alice:
* ton wallet address: 0:290371955258087a35fdeae9fec0b5c69b310f39b90a4bf32dbfed26a5632296
* eth wallet address: 0xBcb9eDA088910ACe1328185d286f1CD5f49aa649

Bob:
* ton wallet address: 0:c0bee8851ee87883a84fa3093eb0db5ccc46f25e7c92eb06d53a9ef18e840d24
* eth wallet address: 0x3613452b0EA100724b071031B8Fe2DAb0097CEd5

### Creating Atomic Swap

Alice crates Atomic Swap transfer on FreeTon:
https://net.ton.live/messages?section=details&id=3e2fc6293759f09025d7ca57633218493b727242c7ca4dcdf4f0c5b364330e32
https://net.ton.live/accounts?section=details&id=0:318481293577870246e85a66048f76775126de9b8015fd62ca777db7752e6c9a
```bash
$ node ./app/app.js -u 0 ton initiate 0:c0bee8851ee87883a84fa3093eb0db5ccc46f25e7c92eb06d53a9ef18e840d24 1
Atomic Swap deployed, params:
{
  "atomicSwapAddress": "0:318481293577870246e85a66048f76775126de9b8015fd62ca777db7752e6c9a",
  "secret": "3c571ae637a65054c0dc63ab3b422532c54f02f7bf556e64fb9475793392f268",
  "secretHash": "e8fd86f1c857d7c82381db888c6e12221888883837aa79874442b1cbdbc61cfa"
}
```

Bob receives address of Atomic Swap contract from Alice and verifies it. Timelock in two days, balance of Atomic Swap sufficient, code hash correct.

```bash
$ node ./app/app.js -u 1 ton params 0:318481293577870246e85a66048f76775126de9b8015fd62ca777db7752e6c9a
Atomic Swap params:
{
  "initiator": "0:290371955258087a35fdeae9fec0b5c69b310f39b90a4bf32dbfed26a5632296",
  "participant": "0:c0bee8851ee87883a84fa3093eb0db5ccc46f25e7c92eb06d53a9ef18e840d24",
  "secretHash": "0xe8fd86f1c857d7c82381db888c6e12221888883837aa79874442b1cbdbc61cfa",
  "amount": "1_000_000_000",
  "atomicSwapBalance": "1_002_989_000",
  "now": "1_600_599_695",
  "timeLock": "1_600_772_416",
  "codeHash": "50b3b047a6ce66ca89f153f2d98432f7f99c950161d53627a269ae80c6d8748f"
}
```

All right, Bob decides to transfer Atomic Swap on ethereum using Alice's `secretHash`.
https://ropsten.etherscan.io/address/0x977Bc3a977Abd6D27b3e4cf3B9b6209DbCE71254
https://ropsten.etherscan.io/tx/0x2ddb1645cf9c19936aed6e5a9a6a0d701db489afec0b3ff2009b8106b3f546e9

```bash
$ node ./app/app.js -u 1 eth participate 0xBcb9eDA088910ACe1328185d286f1CD5f49aa649 1 e8fd86f1c857d7c82381db888c6e12221888883837aa79874442b1cbdbc61cfa
Atomic Swap created
```

Alice verifies Atomic Swap at ethereum network. TimeLock in one days, addresses and amount are correct.

```bash
$ node ./app/app.js -u 0 eth params e8fd86f1c857d7c82381db888c6e12221888883837aa79874442b1cbdbc61cfa
Atomic Swap params:
{
  "0": "0x3613452b0EA100724b071031B8Fe2DAb0097CEd5",
  "1": "0xBcb9eDA088910ACe1328185d286f1CD5f49aa649",
  "2": "1600686693",
  "3": "1600600339",
  "4": "1000000000000000000",
  "5": "0x0000000000000000000000000000000000000000",
  "6": "0",
  "initiator": "0x3613452b0EA100724b071031B8Fe2DAb0097CEd5",
  "participant": "0xBcb9eDA088910ACe1328185d286f1CD5f49aa649",
  "timeLock": "1600686693",
  "currTime": "1600600339",
  "value": "1000000000000000000",
  "tokenAddr": "0x0000000000000000000000000000000000000000",
  "swapType": "0"
}
```

### Redeem Atomic Swap

Allright, Atomic Swaps are created, now Alice can redeem transfer and reveal secret.

https://ropsten.etherscan.io/tx/0x3b2cd2fc313a78a54db8b3b14b2cf1b4d963b2955fc078c726d848bd71a1d3b7

```bash
$ node ./app/app.js -u 0 eth redeem 3c571ae637a65054c0dc63ab3b422532c54f02f7bf556e64fb9475793392f268
 Atomic Swap redeemed
```
```bash
$ node ./app/app.js -u 0 eth balance
Wallet balance:
"2_999_617_075_088_213_500"
```

Bob must retrieve secret and redeem too.

```bash
$ node ./app/app.js -u 1 eth get-secret e8fd86f1c857d7c82381db888c6e12221888883837aa79874442b1cbdbc61cfa
Atomic Swap secret:
"0x3c571ae637a65054c0dc63ab3b422532c54f02f7bf556e64fb9475793392f268"
```

https://net.ton.live/messages?section=details&id=124083d94c09cb81d82124092d1ac29cbc9a6bd32ff550aa651c0065a9b2758f

```bash
$ node ./app/app.js -u 1 ton redeem 0:318481293577870246e85a66048f76775126de9b8015fd62ca777db7752e6c9a 3c571ae637a65054c0dc63ab3b422532c54f02f7bf556e64fb9475793392f268
Redeem success, check balance
```

```bash
$ node ./app/app.js -u 1 ton balance
Atomic Swap Wallet balance:
"1_950_826_918"
```


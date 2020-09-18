require('dotenv').config()
const { program } = require('commander');
const ton = require("./ton.js")
const eth = require("./eth.js")
const btc = require("./btc.js")

async function handleAction(action) {
    try {
        process.env.USER = program.user
        await action()
    } catch(e) {
        console.log(`Error: ${e.message}`)
        console.log(e)
    } finally {
        process.exit() // freeton client couldn't close correctly
    }
}

program.version('0.0.1');

program.option('-u, --user <number>', 'user id, can be used to specify user', 0)

// TON COMMANDS

const tonCmd = program.command('ton')
    .description("command for freeton blockchain")

tonCmd.command('wallet-address')
    .description('compute Atomic Swap Wallet address, you should send there 1 ton for fee')
    .action(async () => {
        await handleAction(async () => {
            const address = await ton.computeAtomicSwapWalletAddress()
            console.log(`Atomic Swap Wallet address:\n${address}`)
        })
    })

tonCmd.command('balance')
    .description('get balnce of Atomic Swap Wallet')
    .action(async () => {
        await handleAction(async () => {
            const result = await ton.getWalletBalance()
            console.log(`Atomic Swap Wallet balance:\n${JSON.stringify(result, null, 2)}`)
        })
    })

tonCmd.command('giver <address> <tons>')
    .description('deploy Atomic Swap Wallet')
    .action(async (address, tons) => {
        await handleAction(async () => {
            await ton.sendGramsFromGiver(address, parseInt(tons) * parseInt(process.env.ONE_TONE))
            console.log(`Success, sent to ${address} ${tons} ton`)
        })
    })

tonCmd.command('deploy-wallet')
    .description('deploy Atomic Swap Wallet')
    .action(async () => {
        await handleAction(async () => {
            await ton.deployAtomicSwapWallet()
            console.log(`Atomic Swap Wallet deployed`)
        })
    })

tonCmd.command('initiate <participant> <tons> [timeSec]')
    .description('create atomic swap')
    .action(async (participant, tons, time) => {
        await handleAction(async () => {
            const lockTime = time ? parseInt(time) : parseInt(process.env.DEFAULT_LOCK_TIME)

            const result = await ton.createAtomicSwap(
                participant,
                parseInt(tons) * parseInt(process.env.ONE_TONE),
                parseInt(Date.now() / 1000) + lockTime * 2
            )
            console.log(`Atomic Swap deployed, params:\n${JSON.stringify(result, null, 2)}`)
        })
    })

tonCmd.command('participate <participant> <tons> <secret-hash> [timeSec]')
    .description('create atomic swap')
    .action(async (participant, tons, secretHash, time) => {
        await handleAction(async () => {
            const lockTime = time ? parseInt(time) : parseInt(process.env.DEFAULT_LOCK_TIME)

            const result = await ton.createAtomicSwap(
                participant,
                parseInt(tons) * parseInt(process.env.ONE_TONE),
                parseInt(Date.now() / 1000) + lockTime,
                secretHash
            )
            console.log(`Atomic Swap deployed, params:\n${JSON.stringify(result, null, 2)}`)
        })
    })

tonCmd.command('params <address>')
    .description('get params to verify atomic swap')
    .action(async (address) => {
        await handleAction(async () => {
            const params = await ton.getAtomicSwapParams(address)
            console.log(`Atomic Swap params:\n${JSON.stringify(params, null, 2)}`)
        })
    })

tonCmd.command('redeem <address> <secret>')
    .description('redeem atomic swap')
    .action(async (address, secret) => {
        await handleAction(async () => {
            await ton.redeemAtomicSwap(address, secret)
            console.log("Redeem success, check balance")
        })
    })

tonCmd.command('get-secret <address>')
    .description('parse secret from atmoic swap')
    .action(async (address) => {
        await handleAction(async () => {
            const secret = await ton.getAtomicSwapSecret(address)
            console.log(`Atomic Swap secret:\n${JSON.stringify(secret, null, 2)}`)
        })
    })

tonCmd.command('refund <address>')
    .description('refund atomic swap')
    .action(async (address) => {
        await handleAction(async () => {
            await ton.refundAtomicSwap(address)
            console.log(`Refund success, check balance`)
        })
    })

tonCmd.command('transfer <address> <nano-ton>')
    .description('transfer tons to somewhere')
    .action(async (address, nanoTon) => {
        await handleAction(async () => {
            await ton.transfer(address, nanoTon)
            console.log(`Transfer success`)
        })
    })


// ETH COMMANDS

const ethCmd = program.command('eth')
    .description("command for ethereum blockchain")

ethCmd.command('wallet-address')
    .description('compute Atomic Swap Wallet address, you should send there 1 ton for fee')
    .action(async () => {
        await handleAction(async () => {
            const address = await eth.getWalletAddress()
            console.log(`Wallet address:\n${address}`)
        })
    })

ethCmd.command('balance')
    .description('get balnce of Atomic Swap Wallet')
    .action(async () => {
        await handleAction(async () => {
            const balance = await eth.getWalletBalance()
            console.log(`Wallet address:\n${JSON.stringify(balance, null, 2)}`)
        })
    })

ethCmd.command('initiate <participant> <eths> [timeSec]')
    .description('create atomic swap')
    .option('-e, --erc20', 'Erc20 address')
    .action(async (participant, eths, time, options) => {
        await handleAction(async () => {
            const lockTime = time ? parseInt(time) : parseInt(process.env.DEFAULT_LOCK_TIME)

            const result = await eth.createAtomicSwap(
                participant,
                parseInt(eths),
                parseInt(Date.now() / 1000) + lockTime * 2, // initiator smust wait twice time to avoid scam,
                undefined, 
                options.erc20
            )
            console.log(`Atomic Swap created, params:\n${JSON.stringify(result, null, 2)}`)
        })
    })

ethCmd.command('participate <participant> <eths> <secret-hash> [timeSec]')
    .description('create atomic swap')
    .option('-e, --erc20', 'Erc20 address')
    .action(async (participant, eths, secretHash, time, options) => {
        await handleAction(async () => {
            const lockTime = time ? parseInt(time) : parseInt(process.env.DEFAULT_LOCK_TIME)

            const result = await eth.createAtomicSwap(
                participant,
                parseInt(eths),
                parseInt(Date.now() / 1000) + lockTime,
                secretHash,
                options.erc20
            )
            console.log(`Atomic Swap created`)
        })
    })

ethCmd.command('params <secret-hash>')
    .description('get params to verify atomic swap')
    .action(async (secretHash) => {
        await handleAction(async () => {
            const params = await eth.getAtomicSwapParams(secretHash)
            console.log(`Atomic Swap params:\n${JSON.stringify(params, null, 2)}`)
        })
    })

ethCmd.command('redeem <secret>')
    .description('redeem atomic swap')
    .action(async (secret) => {
        await handleAction(async () => {
            const params = await eth.redeemAtomicSwap(secret)
            console.log(`Atomic Swap redeemed`)
        })
    })

ethCmd.command('refund <secretHash>')
    .description('get params to verify atomic swap')
    .action(async (secretHash) => {
        await handleAction(async () => {
            const params = await eth.refundAtomicSwap(secretHash)
            console.log(`Atomic Swap refunded`)
        })
    })

ethCmd.command('get-secret <secret-hash>')
    .description('parse secret from atmoic swap')
    .action(async (secretHash) => {
        await handleAction(async () => {
            const secret = await eth.getAtomicSwapSecret(secretHash)
            console.log(`Atomic Swap secret:\n${JSON.stringify(secret, null, 2)}`)
        })
    })

ethCmd.command('transfer <address> <eths>')
    .description('transfer eths to somewhere')
    .action(async (address, eths) => {
        await handleAction(async () => {
            await eth.transfer(address, eths)
            console.log(`Transfer success`)
        })
    })

const btcCmd = program.command('btc')
    .description("command for bitcoin blockchain")

btcCmd.command('get-wallet')
    .description('get keys of your wallet')
    .action(async () => {
        await handleAction(async () => {
            const wallet = await btc.getWallet()
            console.log(`Bitcoin Wallet: ${JSON.stringify(wallet, null, 2)}`)            
        })
    })

btcCmd.command('initiate <participant> [timeSec]')
    .description('generate address of AtomicSwap')
    .action(async (participant, time) => {
        await handleAction(async () => {
            const lockTime = time ? parseInt(time) : parseInt(process.env.DEFAULT_LOCK_TIME)

            const atomicSwapParams = await btc.createAtomicSwap(
                participant, parseInt(Date.now() / 1000) + lockTime * 2, undefined
            )
            console.log(`Bitcoin Atomic Swap params: ${JSON.stringify(atomicSwapParams, null, 2)}`)                        
        })
    })

btcCmd.command('participate <participant> <secret-hash> [timeSec]')
    .description('generate address of AtomicSwap')
    .action(async (participant, secretHash, time) => {
        await handleAction(async () => {
            const lockTime = time ? parseInt(time) : parseInt(process.env.DEFAULT_LOCK_TIME)

            const atomicSwapParams = await btc.createAtomicSwap(
                participant, parseInt(Date.now() / 1000) + lockTime, secretHash
            )
            console.log(`Bitcoin Atomic Swap params: ${JSON.stringify(atomicSwapParams, null, 2)}`)                        
        })
    })

btcCmd.command('verify <initiator> <secret-hash> <p2sh-address> <time-lock>')
    .description('generate address of AtomicSwap')
    .action(async (initiator, secretHash, p2shAddress, timeLock) => {
        await handleAction(async () => {

            const verified = await btc.verifyAtomicSwap(initiator, secretHash, parseInt(timeLock), p2shAddress)
            console.log(`Bitcoin Atomic Swap verified: ${verified}`)                        
        })
    })

btcCmd.command('redeem <initiator> <secret> <time-lock> <tx-id> <tx-vout> <tx-hex> [fee]')
    .description('redeem Atomic Swap')
    .action(async (initiator, secret, timeLock, txId, txVout, txHex, fee) => {
        await handleAction(async () => {

            const tx = {
                id: txId,
                vout: txVout,
                hex: txHex
            }

            if (!fee) {
                fee = 1e3;
            }

            const txRedeem = await btc.redeemAtomicSwap(
                initiator,
                secret,
                timeLock,
                tx,
                fee
            )
            console.log(`Bitcoin Atomic Swap redeem transaction hex: ${txRedeem}`)                        
        })
    })

btcCmd.command('reund <participant> <secret-hash> <time-lock> <tx-id> <tx-vout> <tx-hex> [fee]')
    .description('reund Atomic Swap')
    .action(async (participant, secretHash, timeLock, txId, txVout, txHex, fee) => {
        await handleAction(async () => {

            const tx = {
                id: txId,
                vout: txVout,
                hex: txHex
            }

            if (!fee) {
                fee = 1e3;
            }

            const txRedeem = await btc.redeemAtomicSwap(
                participant,
                secretHash,
                timeLock,
                tx,
                fee
            )
            console.log(`Bitcoin Atomic Swap refund transaction hex: ${txRedeem}`)                        
        })
    })



program.command('reset')
    .description('reset keys and wallets')
    .action(async () => {
        await handleAction(async () => {
            await ton.reset()
            console.log(`Reset success`)
        })
    })

program.parse(process.argv);

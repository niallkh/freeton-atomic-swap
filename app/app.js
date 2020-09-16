require('dotenv').config()
const { program } = require('commander');
const { computeAtomicSwapWalletAddress, deployAtomicSwapWallet, sendGramsFromGiver, createAtomicSwap, 
    getWalletBalance, getAtomicSwapParams, redeemAtomicSwap, getAtomicSwapSecret, refundAtomicSwap, reset, transfer } = require("./ton.js")

program.version('0.0.1');

program.option('-u, --user <number>', 'user id, can be used to specify user', 0)

// TON COMMANDS

const ton = program.command('ton')
    .description("command for freeton blockchain")

ton.command('get-wallet-address')
    .description('compute Atomic Swap Wallet address, you should send there 1 ton for fee')
    .action(async () => {
        try {
            const address = await computeAtomicSwapWalletAddress()
            console.log(`Atomic Swap Wallet address:\n${address}`)
        } catch(e) {
            console.log(`Error: ${e.message}`)
        }
    })

ton.command('balance')
    .description('get balnce of Atomic Swap Wallet')
    .action(async () => {
        try {
            const result = await getWalletBalance()
            console.log(`Atomic Swap Wallet:\n${JSON.stringify(result, null, 2)}`)
        } catch(e) {
            console.log(`Error: ${e.message}`)
        }
    })

ton.command('send-from-giver <address> <tons>')
    .description('deploy Atomic Swap Wallet')
    .action(async (address, tons) => {
        try {
            await sendGramsFromGiver(address, parseInt(tons) * parseInt(process.env.ONE_TONE))
            console.log(`Success, sent to ${address} ${tons} ton`)
        } catch(e) {
            console.log(`Error: ${e.message}`)
        }
    })

ton.command('deploy-wallet')
    .description('deploy Atomic Swap Wallet')
    .action(async () => {
        try {
            await deployAtomicSwapWallet()
            console.log(`Atomic Swap Wallet deployed`)
        } catch(e) {
            console.log(`Error: ${e.message}`)
        }
    })

ton.command('initiate-atomic-swap <participant> <tons> [timeSec]')
    .description('create atomic swap')
    .action(async (participant, tons, time) => {
        try {
            const lockTime = time ? parseInt(time) : parseInt(process.env.DEFAULT_LOCK_TIME)

            const result = await createAtomicSwap(
                participant,
                parseInt(tons) * parseInt(process.env.ONE_TONE),
                parseInt(Date.now() / 1000) + lockTime * 2
            )
            console.log(`Atomic Swap deployed, params:\n${JSON.stringify(result, null, 2)}`)
        } catch(e) {
            console.log(`Error: ${e.message}`)
        }
    })

ton.command('participate-atomic-swap <participant> <tons> <secret-hash> [timeSec]')
    .description('create atomic swap')
    .action(async (participant, tons, secretHash, time) => {
        try {
            const lockTime = time ? parseInt(time) : parseInt(process.env.DEFAULT_LOCK_TIME)

            const result = await createAtomicSwap(
                participant,
                parseInt(tons) * parseInt(process.env.ONE_TONE),
                parseInt(Date.now() / 1000) + lockTime,
                secretHash
            )
            console.log(`Atomic Swap deployed, params:\n${JSON.stringify(result, null, 2)}`)
        } catch(e) {
            console.log(`Error: ${e.message}`)
        }
    })

ton.command('atomic-swap-params <address>')
    .description('get params to verify atomic swap')
    .action(async (address) => {
        try {
            const params = await getAtomicSwapParams(address)
            console.log(`Atomic Swap params:\n${JSON.stringify(params, null, 2)}`)
        } catch(e) {
            console.log(`Error: ${e.message}`)
        }
    })

ton.command('redeem <address> <secret>')
    .description('redeem atomic swap')
    .action(async (address, secret) => {
        try {
            await redeemAtomicSwap(address, secret)
            console.log("Redeem success, check balance")
        } catch(e) {
            console.log(`Error: ${e.message}`)
        }
    })

ton.command('get-secret <address>')
    .description('parse secret from atmoic swap')
    .action(async (address) => {
        try {
            const secret = await getAtomicSwapSecret(address)
            console.log(`Atomic Swap secret:\n${JSON.stringify(secret, null, 2)}`)
        } catch(e) {
            console.log(`Error: ${e.message}`)
        }
    })

ton.command('refund <address>')
    .description('refund atomic swap')
    .action(async (address) => {
        try {
            await refundAtomicSwap(address)
            console.log(`Refund success, check balance`)
        } catch(e) {
            console.log(`Error: ${e.message}`)
        }
    })

ton.command('transfer <address> <nano-ton>')
    .description('transfer tons to somewhere')
    .action(async (address, nanoTon) => {
        try {
            await transfer(address, nanoTon)
            console.log(`Transfer success`)
        } catch(e) {
            console.log(`Error: ${e.message}`)
        }
    })

ton.command('reset')
    .description('reset keys and wallet')
    .action(async () => {
        try {
            await reset()
            console.log(`Reset success`)
        } catch(e) {
            console.log(`Error: ${e.message}`)
        }
    })

program.parse(process.argv);

process.env.USER = program.user

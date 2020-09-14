const bitcoin = require('bitcoinjs-lib')
const { alice, bob, dave } = require('./wallets.json')
const giver = dave
const network = bitcoin.networks.regtest
const bip65 = require('bip65')

const keyPairAlice1 = bitcoin.ECPair.fromWIF(alice[1].wif, network)
const keyPairBob1 = bitcoin.ECPair.fromWIF(bob[1].wif, network)

describe("Atomic Swap Titcoin", async function() {

    before(async () => {

        const psbt = new bitcoin.Psbt()

        psbt.addInput({
            // if hash is string, txid, if hash is Buffer, is reversed compared to txid
            hash: '7d067b4a697a09d2c3cff7d4d9506c9955e93bff41bf82d439da7d030382bc3e',
            index: 0,

            // non-segwit inputs now require passing the whole previous tx as Buffer
            nonWitnessUtxo: Buffer.from(
                '0200000001f9f34e95b9d5c8abcd20fc5bd4a825d1517be62f0f775e5f36da944d9' +
                '452e550000000006b483045022100c86e9a111afc90f64b4904bd609e9eaed80d48' +
                'ca17c162b1aca0a788ac3526f002207bb79b60d4fc6526329bf18a77135dc566020' +
                '9e761da46e1c2f1152ec013215801210211755115eabf846720f5cb18f248666fec' +
                '631e5e1e66009ce3710ceea5b1ad13ffffffff01' +
                // value in satoshis (Int64LE) = 0x015f90 = 90000
                '905f010000000000' +
                // scriptPubkey length
                '19' +
                // scriptPubkey
                '76a9148bbc95d2709c71607c60ee3f097c1217482f518d88ac' +
                // locktime
                '00000000',
                'hex',
            ),

            // // If this input was segwit, instead of nonWitnessUtxo, you would add
            // // a witnessUtxo as follows. The scriptPubkey and the value only are needed.
            // witnessUtxo: {
            //   script: Buffer.from(
            //     '76a9148bbc95d2709c71607c60ee3f097c1217482f518d88ac',
            //     'hex',
            //   ),
            //   value: 90000,
            // },


        })
    })

})

// function cltvCheckSigOutput(aQ, bQ, lockTime) {
//   return bitcoin.script.fromASM(
//     `
//       OP_IF
//           ${bitcoin.script.number.encode(lockTime).toString('hex')}
//           OP_CHECKLOCKTIMEVERIFY
//           OP_DROP
//       OP_ELSE
//           ${bQ.publicKey.toString('hex')}
//           OP_CHECKSIGVERIFY
//       OP_ENDIF
//       ${aQ.publicKey.toString('hex')}
//       OP_CHECKSIG
//     `
//       .trim()
//       .replace(/\s+/g, ' '),
//   );
// }

// const lockTime = bip65.encode({utc: Math.floor(Date.now() / 1000) - (3600 * 24)}) 
// console.log('Timelock in UNIX timestamp:')
// console.log(lockTime)

// const redeemScript = cltvCheckSigOutput(keyPairAlice1, keyPairBob1, lockTime)
// console.log('Redeem script:')
// console.log(redeemScript.toString('hex'))

// const p2sh = bitcoin.payments.p2sh({redeem: {output: redeemScript, network}, network})
// console.log('P2SH address:')
// console.log(p2sh.address)

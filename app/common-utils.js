const util = require('util');
const fs = require('fs')
const { createSecretAndHash } = require("freeton-atomic-swap-btc")

const readAsync = util.promisify(fs.readFile)
const writeAsync = util.promisify(fs.writeFile)
const accessAsync = util.promisify(fs.access)
const unlinkAsync = util.promisify(fs.unlink)

async function save(update) {
    const db = await load()
    await writeAsync(dbName(), JSON.stringify({ ...db, ...update }, null, 2))
}

async function load() {
    const db = dbName()
    try {
        await accessAsync(db, fs.constants.F_OK)
        return JSON.parse(await readAsync(db))
    } catch(e) {
        return {}
    }
}

async function resetStorage() {
    await writeAsync(dbName(), JSON.stringify({}, null, 2))
}

function prettyNumber(balance) {
    const str = balance.toString()
    let result = ""
    for (let i = 0; i < str.length; i++) {
        result += str[i]
        if (i != str.length - 1 && (str.length - i) % 3 == 1) {
          result += '_'
        }
    }
    return result
}

function dbName() {
    return `user-${process.env.USER}-${process.env.DB_NAME}.json`
}

module.exports = {
    save,
    load,
    prettyNumber,
    resetStorage,
    createSecretAndHash
}
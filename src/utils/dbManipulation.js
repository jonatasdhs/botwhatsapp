const fs = require('fs')

function readDb(dbName = 'contacts.json') {
    const data = fs.readFileSync(dbName, 'utf-8')
    return JSON.parse(data)
}

function writeDb(obj, dbName = 'contacts.json') {
    const db = readDb()
    const contacts = db.contacts
    /* db.contacts.push(obj) */
    contacts.push(obj)
    try {
        fs.writeFileSync(dbName, JSON.stringify(db))
    } catch (e) {
        console.log('Save failed!')
        console.log(e)
    }
}

function updateDb(obj, dbName = 'contacts.json') {
    try {
        fs.writeFileSync(dbName, JSON.stringify(obj))
    } catch (e) {
        console.log('Save failed!')
        console.log(e)
    }
}

function writeQR(str, dbName = 'qr.json') {
    try {
        fs.writeFileSync(dbName, JSON.stringify(str))
    } catch (e) {
        console.log('Save failed!')
        console.log(e)
    }
}

console.log(readDb('qr.json'))

module.exports = { writeDb, readDb, writeQR, updateDb }
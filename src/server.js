const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal')
const express = require('express');
const { readDb, writeDb, updateDb } = require('./utils/dbManipulation');
const QRCode = require('qrcode')
const cors = require('cors')
const { join } = require('node:path');
const { Server } = require("socket.io");
const { createServer } = require('node:http');
const { introduction, question, badEnding, confirmationText, confirmation3, confirmation2, goodEnding } = require('./utils/constants');

const app = express()
const server = createServer(app);

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

app.use(express.json())
app.use(cors())

io.on("connection", (socket) => { })

let qrcodeVar
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('ready', () => {
    io.emit("qr-connected")
    console.log('Client is ready!');
});

function generateQR() {
    return client.on('qr', qr => {
        qrcode.generate(qr, { small: true }, function (qrcode) {
            qrcodeVar = qrcode
            console.log(qrcode)
        });
    });
}

generateQR()

client.on('qr', qr => {
    qrcode.generate(qr, { small: true }, function (qrcode) {
        qrcodeVar = qrcode
        console.log(qrcode)
        io.emit('_qr', qr)
    });
});

app.post("/sendMessage", async (req, res) => {
    const contacts = req.body
    const data = readDb()
    const user = data.contacts.find((element) => element.phone === contacts.phone)

    if (!user) res.send(404, "User not found!")

    await client.sendMessage(user.phone + "@c.us", `${introduction(user.name, user.sueNumber, user.company)}`)
        .then((result) => {
            console.log('Result: ', result); //return object success
        })
        .catch((erro) => {
            console.error('Error when sending: ', erro); //return object error
        });

    res.send({ user: user, request: req.body })
})

app.get("/allContacts", async (req, res) => {
    const contacts = await client.getContacts()
    res.send(contacts)
})

app.post("/addContact", async (req, res) => {
    const newContact = req.body
    /* const db = readDb() */
    writeDb(newContact)
    res.status(201).send(newContact)
})

app.get("/getContacts", async (req, res) => {
    const contacts = readDb()
    res.status(200).send(contacts)
})

app.get("/qrcode", async (req, res) => {
    res.status(200).send(qrcodeVar)
})

app.get("/healthChecker", async (req, res) => {
    io.emit("Qr code was read!")
    res.status(200).send("Hello World!")
})

client.on("message_create", async (message) => {

    if (message.body == "Confirmo") {
        await client.sendMessage(message.from, confirmationText)
        client.sendMessage(message.from, question)
            .then((result) => {
                console.log('Result: ', result); //return object success
            })
            .catch((erro) => {
                console.error('Error when sending: ', erro); //return object error
            });
    }

    if (message.body == "Não") {
        client.sendMessage(message.from, badEnding)
        let data = readDb()
        const findContact = data.contacts.find((contact) => contact.phone === message.from.slice(0, 12))
        const index = data.contacts.indexOf(findContact)
        const updatedContact = {
            ...findContact,
            status: "recusado"
        }
        data.contacts[index] = updatedContact
        updateDb(data)
    }

    if (message.body == "Tenho interesse" || message.body == "Ainda tenho dúvidas") {
        client.sendMessage(message.from, goodEnding)
        let data = readDb()
        const findContact = data.contacts.find((contact) => contact.phone === message.from.slice(0, 12))
        const index = data.contacts.indexOf(findContact)
        const updatedContact = {
            ...findContact,
            status: "confirmado"
        }
        data.contacts[index] = updatedContact
        updateDb(data)
    }
})

server.listen(3000, () => {
    client.initialize();
    console.log(`Server listening on PORT: 3000`)
})
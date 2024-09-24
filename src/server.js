const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const { readDb, writeDb, updateDb } = require('./utils/dbManipulation');
const QRCode = require('qrcode');
const cors = require('cors');
const { join } = require('node:path');
const { Server } = require("socket.io");
const { createServer } = require('node:http');
const { introduction, question, badEnding, confirmationText, confirmation3, confirmation2, goodEnding, question2 } = require('./utils/constants');

const app = express();
const server = createServer(app);

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

app.use(express.json());
app.use(cors());

io.on("connection", (socket) => { });

let qrcodeVar;
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('ready', () => {
    io.emit("qr-connected");
    console.log('Client is ready!');
});

function generateQR() {
    return client.on('qr', qr => {
        qrcode.generate(qr, { small: true }, function (qrcode) {
            qrcodeVar = qrcode;
            console.log(qrcode);
        });
    });
}

generateQR();

client.on('qr', qr => {
    qrcode.generate(qr, { small: true }, function (qrcode) {
        qrcodeVar = qrcode;
    });
});

// Objeto para armazenar o estado de cada usuário
let userStates = {};

// Função para obter o estado do usuário
function getUserState(phone) {
    return userStates[phone] || 'initial'; // Estado inicial se não houver estado salvo
}

// Função para definir o estado do usuário
function setUserState(phone, state) {
    userStates[phone] = state;
}

app.post("/sendMessage", async (req, res) => {
    const contacts = req.body;
    const data = readDb();
    const user = data.contacts.find((element) => element.phone === contacts.phone);

    if (!user) return res.status(404).send("User not found!");

    await client.sendMessage(user.phone + "@c.us", `${introduction(user.name, user.sueNumber, user.company)}`)
        .then((result) => {
            console.log('Result: ', result); //return object success
        })
        .catch((erro) => {
            console.error('Error when sending: ', erro); //return object error
        });

    res.send({ user: user, request: req.body });
});

app.get("/allContacts", async (req, res) => {
    const contacts = await client.getContacts();
    res.send(contacts);
});

app.post("/addContact", async (req, res) => {
    const newContact = req.body;
    writeDb(newContact);
    res.status(201).send(newContact);
});

app.get("/getContacts", async (req, res) => {
    const contacts = readDb();
    res.status(200).send(contacts);
});

app.get("/qrcode", async (req, res) => {
    res.status(200).send(qrcodeVar);
});

app.get("/healthChecker", async (req, res) => {
    io.emit("Qr code was read!");
    res.status(200).send("Hello World!");
});

// Lógica de controle de estado nas mensagens recebidas
client.on("message_create", async (message) => {
    const phone = message.from;
    const currentState = getUserState(phone);

    // Estado inicial
    if (currentState === 'initial') {
        if (message.body === "1") {
            await client.sendMessage(phone, confirmationText);
            await client.sendMessage(phone, question);
            await client.sendMessage(phone, question2);
            setUserState(phone, 'waitingForSecondAnswer'); // Muda para o estado da segunda pergunta
        } else if (message.body === "2") {
            await client.sendMessage(phone, badEnding);
            let data = readDb();
            const findContact = data.contacts.find(contact => contact.phone === phone.slice(0, 12));
            const index = data.contacts.indexOf(findContact);
            const updatedContact = {
                ...findContact,
                status: "recusado"
            };
            data.contacts[index] = updatedContact;
            updateDb(data);
        }
    }

    // Estado esperando pela segunda resposta
    else if (currentState === 'waitingForSecondAnswer') {
        if (message.body === "1" || message.body === "2") {
            await client.sendMessage(phone, goodEnding);
            let data = readDb();
            const findContact = data.contacts.find(contact => contact.phone === phone.slice(0, 12));
            const index = data.contacts.indexOf(findContact);
            const updatedContact = {
                ...findContact,
                status: "confirmado"
            };
            data.contacts[index] = updatedContact;
            updateDb(data);

            // Depois de finalizar o fluxo, reseta o estado para 'initial'
            setUserState(phone, 'initial');
        }
    }
});

server.listen(3000, () => {
    client.initialize();
    console.log(`Server listening on PORT: 3000`);
});

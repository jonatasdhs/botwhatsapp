const Server = require('socket.io');


const initiateScoket = (server) => {
  const io = new Server(server, {
    path: "/socket/"
  })

  io.on("connection", (socket) => {
  })

  return io
}

module.exports = {initiateScoket}
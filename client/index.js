const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const ioClient = require("socket.io-client");
const mongoose = require('mongoose');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const handleConnection = require('./sockets/handleConnection');
const handleJoinRoom = require('./sockets/handleJoinRoom');
const handleCreateRoom = require('./sockets/handleCreateRoom');


//izmeniti password, staviti u .env
mongoose.connect('mongodb+srv://Dojcinovic00:Dojcinovic00@aipsmongodb.izijcoe.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));


app.get("/", (req, res) => {
  res.send("API is Running");
});

io.on('connection', (socket) => {
    handleConnection(socket, io);
  
    handleJoinRoom(socket, io);

    handleCreateRoom(socket, io);

  });
  

const testClient = ioClient.connect("http://localhost:5000");

testClient.emit("create room", "test-room");

setTimeout(() => {
  testClient.disconnect();
}, 5000);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server Started on PORT ${PORT}`);
});

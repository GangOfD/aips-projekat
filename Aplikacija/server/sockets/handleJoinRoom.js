
const Player = require('../models/playerModel');
function handleJoinRoom(socket, io) {
  socket.on('join room', async (data) => {
    const { roomID, playerName } = data;

    try {
      const room = io.sockets.adapter.rooms[roomID];
      if (!room) {
        socket.emit('join room error', { message: 'Room does not exist' });
        return;
      }

      const roomCapacity = numOfPlayers;
      if (room.length >= roomCapacity) {
        socket.emit('join room error', { message: 'Room is full' });
        return;
      }

      if (!playerName || playerName.trim() === '') {
        socket.emit('join room error', { message: 'Invalid player name' });
        return;
      }

      const player = new Player({
        name: playerName,
        roomId: roomID,
      });

   
      await player.save();

      socket.join(roomID);

      io.sockets.adapter.rooms[roomID].participants = (io.sockets.adapter.rooms[roomID].participants || 0) + 1;

      if (io.sockets.adapter.rooms[roomID].participants === roomCapacity) {
        io.to(roomID).emit('redirect', `/game?roomID=${roomID}`);
      } else {
        io.to(roomID).emit('new player joined', { playerName });
      }
    } catch (error) {
      console.error('Error joining room:', error.message);
      socket.emit('join room error', { message: 'Error joining room' });
    }
  });
}

module.exports = handleJoinRoom;


const { v4: uuidv4 } = require('uuid');

function handleCreateRoom(socket, io) {
  socket.on('create room', () => {
    try {
      const roomID = uuidv4();

      io.sockets.adapter.rooms[roomID] = { participants: 0 };

      socket.join(roomID);

      socket.emit('room created', { roomID });
      console.log("new room is created. room id is " , roomID)
      socket.emit('redirect', `/wait?roomID=${roomID}`);
    } catch (error) {
      console.error('Error creating room:', error.message);
      socket.emit('create room error', { message: 'Error creating room' });
    }
  });
}

module.exports = handleCreateRoom;

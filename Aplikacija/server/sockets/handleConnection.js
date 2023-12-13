
function handleConnection(socket, io) {
    try {
      console.log('A user connected:', socket.id);
  
  
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
  
      });
    } catch (error) {
      console.error('Error handling connection:', error.message);
    }
  }
  
  module.exports = handleConnection;
  
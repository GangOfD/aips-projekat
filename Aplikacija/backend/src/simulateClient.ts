 // simulateClient.ts
import io from 'socket.io-client';

 export const simulateClient = () => {
     const socket = io('http://localhost:3002');  

     socket.on('connect', () => {
         console.log('\x1b[34m', 'Simulated client connected');

        socket.emit('joinGame', { roomId: '67', userId: '657f1f0a3176e2817db8312c' });

      //  socket.emit('receiveAnswer', { roomId: '67', userId: '657f1f0a3176e2817db8312c', answer:1 });

        socket.on('newQuestion', (data) => {
            console.log('\x1b[34m','Stiglo pitanje:', data);
            //socket.emit('receiveAnswer', { gameId: '67', userId: '657f1f0a3176e2817db8312c', answerValue:1 });
          //  socket.emit('receiveAnswer', { gameId: '67',token, answerValue:1 });

        });

        socket.on('questionResults', (data) => {
          console.log('\x1b[34m','Stigli rezultati:', data);
      });

      socket.on('gameJoined', (data) => {
        console.log('\x1b[34m','Joined game:', data);
    });

    socket.on('gameOver', (data) => {
      console.log('\x1b[34m','Game is over, final results are: ', data);
  });

        socket.on('gameStarted', async (data)=> {
            try{
                //redirektujes, prikazes data, ime sobe i korisnici koji su u sobi.
              console.log('\x1b[34m',"Socket is receiving! Game started!")
            }
            catch(error){
              console.error('\x1b[34m','Error in socket joinGame:', error);
              socket.emit('joinError', 'Error joining game');
            }
          })
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Simulated client disconnected');
    });
};

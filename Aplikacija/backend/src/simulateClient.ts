// simulateClient.ts
import io from 'socket.io-client';

export const simulateClient = () => {
    const socket = io('http://localhost:3002');  // Update the URL to match your server

    socket.on('connect', () => {
        console.log('Simulated client connected');

        // Emit events or perform actions as the client
        socket.emit('joinGame', { roomId: '67', userId: '6593383bda44f032bf567eff' });


        // Handle any events that the server sends to the client
        socket.on('gameJoined', (data) => {
            console.log('Joined game:', data);
        });

        socket.on('gameStarted', async (data)=> {
            try{
                //redirektujes, prikazes data, ime sobe i korisnici koji su u sobi.
              console.log("Socket is receiving!")
            }
            catch(error){
              console.error('Error in socket joinGame:', error);
              socket.emit('joinError', 'Error joining game');
            }
          })
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Simulated client disconnected');
    });
};

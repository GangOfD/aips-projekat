// simulateClient.ts
import io from 'socket.io-client';

export const simulateClient = () => {
    const socket = io('http://localhost:3002');  // Update the URL to match your server

    socket.on('connect', () => {
        console.log('Simulated client connected');

        // Emit events or perform actions as the client
        socket.emit('joinGame', { roomId: '67', userId: '657deb4e40fd08aea087377c' });

        // Handle any events that the server sends to the client
        socket.on('gameJoined', (data) => {
            console.log('Joined game:', data);
        });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Simulated client disconnected');
    });
};

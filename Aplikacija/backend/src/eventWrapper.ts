
import { Socket } from 'socket.io';
import {verifySocketToken} from './middleware/authenticate';

type EventHandler = (data: any, socket: Socket) => Promise<void>;

const wrapEvent = (socket: Socket, eventName: string, handler: EventHandler) => {
    socket.on(eventName, async (data) => {
        try {
            await verifySocketToken(socket, data, async (modifiedData:any) => {
                await handler(modifiedData, socket);
            });
        } catch (error) {
            console.error(`Error in ${eventName}:`, error);
            socket.emit(`${eventName}Error`, 'An error occurred');
        }
    });
};

export default wrapEvent;

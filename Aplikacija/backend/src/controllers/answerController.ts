import AnswerCommand from '../commands/AnswerCommand'
import { Socket } from 'socket.io';

export const receiveAnswer = async (data: { userId: string, answerValue: any, gameId: string }, socket: Socket) => {
    try {
        const { userId, answerValue, gameId } = data;

        const command = new AnswerCommand(userId, answerValue, gameId);
        command.execute();

        socket.emit('answerReceived', { userId, status: 'success' });
    } catch (error) {
        console.error('Error in receiveAnswer:', error);
        socket.emit('receiveAnswerError', { error: 'Error while answering' });
    }
};
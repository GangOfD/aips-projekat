import AnswerCommand from '../commands/AnswerCommand'
import {KeyPressCommand} from '../commands/KeyPressCommand'
import { Socket } from 'socket.io';
import store from '../managers/store';

export const receiveAnswer = async (data: { userId: string, answerValue: any, gameId: string }, socket: Socket) => {
    try {
        const { userId, answerValue, gameId } = data;

        const command = new AnswerCommand(userId, answerValue, gameId,store);
        command.execute();

        socket.emit('answerReceived', { userId, status: 'success' });
    } catch (error) {
        console.error('Error in receiveAnswer:', error);
        socket.emit('receiveAnswerError', { error: 'Error while answering' });
    }
};


export const receiveKeyAnswer = async (data: { userId: string, keyPressed: string, gameId: string }, socket: Socket) => {
    try {
        const { userId, keyPressed, gameId } = data;

        const command = new KeyPressCommand(userId, keyPressed, gameId,store);
        command.execute();

        socket.emit('KeyAnswerReceived', { userId, status: 'success' });
    } catch (error) {
        console.error('Error in receiveAnswer:', error);
        socket.emit('receiveAnswerError', { error: 'Error while answering' });
    }
};



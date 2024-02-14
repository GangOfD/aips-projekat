import axios from 'axios';
import { HostMessageParams } from '../models/hostModel';

export const getHostMessage = async (params: HostMessageParams) => {
    try {
        const endpointUrl = 'http://localhost:5000/chat-gpt';

        const prompt = "Act as if you were a game host. Give some roasting comments";
        console.log("Ja saljem ", params)

        const response = await axios.post(endpointUrl, { hostMess: params });

        const hostMessage = response.data.response;

        return hostMessage;
    } catch (error) {
        console.error('Error fetching host message:', error);
        throw new Error('Failed to fetch host message');
    }
};

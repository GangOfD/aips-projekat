require('dotenv').config();
import axios from 'axios';
import { HostMessageParams } from '../models/hostModel';

export const getHostMessage = async (params: HostMessageParams) => {
    try {

        const endpointUrl = `${process.env.API_BASE_URL}${process.env.API_PATH}`;

        const response = await axios.post(endpointUrl, { hostMess: params });

        const hostMessage = response.data.response;

        return hostMessage;
    } catch (error) {
        console.error('Error fetching host message:', error);
        throw new Error('Failed to fetch host message');
    }
};

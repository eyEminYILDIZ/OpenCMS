import axios from 'axios';
import { Platform } from 'react-native';

// Android emulator routes 10.0.2.2 to the host machine's localhost
const API_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const PORT = 5010; // Replace with your actual port number

const initializeAxios = () => {
    const instance = axios.create({
        baseURL: `http://${API_HOST}:${PORT}`,
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return instance;
};

export const ApiClient = initializeAxios();
import axios from 'axios';

const initializeAxios = () => {
    const instance = axios.create({
        baseURL: 'http://localhost:5020',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return instance;
};

export const ApiClient = initializeAxios();
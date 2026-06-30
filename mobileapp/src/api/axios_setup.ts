import axios from 'axios';
import { reaction } from 'mobx';
import { settingsStore } from '../stores/SettingsStore';

const initializeAxios = () => {
    const instance = axios.create({
        baseURL: `http://${settingsStore.serverAddress}`,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    reaction(
        () => settingsStore.serverAddress,
        (serverAddress) => {
            instance.defaults.baseURL = `http://${serverAddress}`;
        },
    );

    return instance;
};

export const ApiClient = initializeAxios();

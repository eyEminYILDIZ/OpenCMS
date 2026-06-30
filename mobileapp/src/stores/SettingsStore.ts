import { makeAutoObservable, runInAction } from "mobx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const STORAGE_KEY = "cms_settings";

interface PersistedSettings {
    serverAddress: string;
}

const defaultServerAddress = `localhost:5010`;

export class SettingsStore {
    serverAddress: string = defaultServerAddress;

    constructor() {
        makeAutoObservable(this);
        this.loadFromStorage();
    }

    private loadFromStorage = async () => {
        try {
            const raw = await AsyncStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw) as Partial<PersistedSettings>;
                runInAction(() => {
                    this.serverAddress = parsed.serverAddress ?? defaultServerAddress;
                });
            }
        } catch {
            // ignore corrupt data
        }
    };

    private persist = () => {
        const settings: PersistedSettings = {
            serverAddress: this.serverAddress,
        };
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings)).catch(() => { });
    };

    setServerAddress = (value: string) => {
        this.serverAddress = value;
        this.persist();
    };
}

export const settingsStore = new SettingsStore();

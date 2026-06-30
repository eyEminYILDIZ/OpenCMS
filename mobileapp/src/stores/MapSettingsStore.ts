import { action, makeObservable, observable } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'cms_map_settings';

interface PersistedSettings {
    automaticTracking: boolean;
    automaticFocusing: boolean;
    satelliteView: boolean;
}

const defaultSettings: PersistedSettings = { automaticTracking: true, automaticFocusing: true, satelliteView: false };

export class MapSettingsStore {
    automaticTracking: boolean = true;
    automaticFocusing: boolean = true;
    satelliteView: boolean = false;

    constructor() {
        makeObservable(this, {
            automaticTracking: observable,
            automaticFocusing: observable,
            satelliteView: observable,
            setAutomaticTracking: action,
            setAutomaticFocusing: action,
            setSatelliteView: action,
        });
        this.loadFromStorage();
    }

    private loadFromStorage = async () => {
        try {
            const raw = await AsyncStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw) as Record<string, unknown>;
                action(() => {
                    this.automaticTracking = (parsed.automaticTracking as boolean) ?? true;
                    this.automaticFocusing = ((parsed.automaticFocusing ?? parsed.automaticZooming) as boolean) ?? true;
                    this.satelliteView = (parsed.satelliteView as boolean) ?? false;
                })();
            }
        } catch {
            // ignore corrupt data
        }
    };

    setAutomaticTracking(value: boolean) {
        this.automaticTracking = value;
        this.persist();
    }

    setAutomaticFocusing(value: boolean) {
        this.automaticFocusing = value;
        this.persist();
    }

    setSatelliteView(value: boolean) {
        this.satelliteView = value;
        this.persist();
    }

    private persist() {
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
            automaticTracking: this.automaticTracking,
            automaticFocusing: this.automaticFocusing,
            satelliteView: this.satelliteView,
        })).catch(() => {});
    }
}

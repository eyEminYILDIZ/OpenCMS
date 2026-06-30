import { action, makeObservable, observable } from 'mobx';

const STORAGE_KEY = 'cms_map_settings';

interface PersistedSettings {
    automaticTracking: boolean;
    automaticFocusing: boolean;
    satelliteView: boolean;
}

const loadFromStorage = (): PersistedSettings => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw) as Record<string, unknown>;
            return {
                automaticTracking: parsed.automaticTracking as boolean ?? true,
                // support old key name from previous session
                automaticFocusing: (parsed.automaticFocusing ?? parsed.automaticZooming) as boolean ?? true,
                satelliteView: parsed.satelliteView as boolean ?? false,
            };
        }
    } catch {
        // ignore corrupt data
    }
    return { automaticTracking: true, automaticFocusing: true, satelliteView: false };
};

export class MapSettingsStore {
    automaticTracking: boolean;
    automaticFocusing: boolean;
    satelliteView: boolean;

    constructor() {
        const saved = loadFromStorage();
        this.automaticTracking = saved.automaticTracking;
        this.automaticFocusing = saved.automaticFocusing;
        this.satelliteView = saved.satelliteView;

        makeObservable(this, {
            automaticTracking: observable,
            automaticFocusing: observable,
            satelliteView: observable,
            setAutomaticTracking: action,
            setAutomaticFocusing: action,
            setSatelliteView: action,
        });
    }

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
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            automaticTracking: this.automaticTracking,
            automaticFocusing: this.automaticFocusing,
            satelliteView: this.satelliteView,
        }));
    }
}

import { action, makeObservable, observable } from 'mobx';

const STORAGE_KEY = 'cms_map_settings';

interface PersistedSettings {
    automaticTracking: boolean;
    automaticFocusing: boolean;
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
            };
        }
    } catch {
        // ignore corrupt data
    }
    return { automaticTracking: true, automaticFocusing: true };
};

export class MapSettingsStore {
    automaticTracking: boolean;
    automaticFocusing: boolean;

    constructor() {
        const saved = loadFromStorage();
        this.automaticTracking = saved.automaticTracking;
        this.automaticFocusing = saved.automaticFocusing;

        makeObservable(this, {
            automaticTracking: observable,
            automaticFocusing: observable,
            setAutomaticTracking: action,
            setAutomaticFocusing: action,
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

    private persist() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            automaticTracking: this.automaticTracking,
            automaticFocusing: this.automaticFocusing,
        }));
    }
}

import { makeAutoObservable, runInAction } from "mobx";

export type StatusLevel = "info" | "success" | "warning" | "error";

export class StatusBarStore {
    message: string = "Ready";
    level: StatusLevel | null = null;
    fading: boolean = false;

    private clearTimer: ReturnType<typeof setTimeout> | null = null;
    private fadeTimer: ReturnType<typeof setTimeout> | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    showSuccess = (message: string) => {
        this.message = message;
        this.level = "success";
        this.fading = false;
        this.scheduleAutoClear();
    };

    showInfo = (message: string) => {
        this.message = message;
        this.level = "info";
        this.fading = false;
        this.scheduleAutoClear();
    };

    showWarning = (message: string) => {
        this.message = message;
        this.level = "warning";
        this.fading = false;
        this.scheduleAutoClear();
    };

    showError = (message: string) => {
        this.message = message;
        this.level = "error";
        this.fading = false;
        this.scheduleAutoClear();
    };

    clear = () => {
        this.fading = true;
        if (this.fadeTimer) clearTimeout(this.fadeTimer);
        this.fadeTimer = setTimeout(() => {
            runInAction(() => {
                this.message = "Ready";
                this.level = null;
                this.fading = false;
                this.fadeTimer = null;
            });
        }, 300);
    };

    private scheduleAutoClear = () => {
        if (this.clearTimer) clearTimeout(this.clearTimer);
        this.clearTimer = setTimeout(() => {
            this.clear();
            this.clearTimer = null;
        }, 5000);
    };
}

import { makeAutoObservable, runInAction } from "mobx";
import { Info, TriangleAlert, CircleX, LucideIcon } from "lucide-react";

export type StatusLevel = "info" | "warning" | "error";

export class StatusBarStore {
    message: string = "Ready";
    icon: LucideIcon | null = null;
    level: StatusLevel | null = null;
    fading: boolean = false;

    private clearTimer: ReturnType<typeof setTimeout> | null = null;
    private fadeTimer: ReturnType<typeof setTimeout> | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    showInfo = (message: string, icon: LucideIcon = Info) => {
        this.icon = icon;
        this.message = message;
        this.level = "info";
        this.fading = false;
        this.scheduleAutoClear();
    };

    showWarning = (message: string, icon: LucideIcon = TriangleAlert) => {
        this.icon = icon;
        this.message = message;
        this.level = "warning";
        this.fading = false;
        this.scheduleAutoClear();
    };

    showError = (message: string, icon: LucideIcon = CircleX) => {
        this.icon = icon;
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
                this.icon = null;
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

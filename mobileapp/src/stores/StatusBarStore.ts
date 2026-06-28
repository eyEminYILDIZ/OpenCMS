import { makeAutoObservable } from "mobx";
import Toast from "react-native-toast-message";

export type StatusLevel = "info" | "success" | "warning" | "error";

export class StatusBarStore {
    constructor() {
        makeAutoObservable(this);
    }

    showSuccess = (message: string) => {
        Toast.show({ type: "success", text1: message, visibilityTime: 3000 });
    };

    showInfo = (message: string) => {
        Toast.show({ type: "info", text1: message, visibilityTime: 3000 });
    };

    showWarning = (message: string) => {
        Toast.show({ type: "error", text1: message, visibilityTime: 4000 });
    };

    showError = (message: string) => {
        Toast.show({ type: "error", text1: message, visibilityTime: 5000 });
    };

    clear = () => {
        Toast.hide();
    };
}

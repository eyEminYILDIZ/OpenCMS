import { observer } from "mobx-react-lite";
import { stores } from "../../stores";

const StatusBar = observer(() => {
    const { statusBarStore } = stores;
    const Icon = statusBarStore.icon;

    const classes = [
        "status-bar",
        statusBarStore.level ? `status-bar--${statusBarStore.level}` : "",
        statusBarStore.fading ? "status-bar--fading" : "",
    ].filter(Boolean).join(" ");

    return (
        <div className={classes} role="status" aria-live="polite">
            {Icon && <Icon size={14} />}
            <span>{statusBarStore.message}</span>
        </div>
    );
});

export default StatusBar;

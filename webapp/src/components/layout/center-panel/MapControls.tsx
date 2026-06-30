import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { stores } from '../../../stores';

export const MapControls: React.FC = observer(() => {
    const { t } = useTranslation();
    const { mapSettingsStore } = stores;

    return (
        <div style={{
            position: 'absolute',
            bottom: 56,
            left: 16,
            zIndex: 10,
            background: 'white',
            borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
            padding: '10px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            minWidth: 190,
        }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#555', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>
                {t('mapControls.title')}
            </span>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#222', userSelect: 'none' }}>
                <input
                    type="checkbox"
                    checked={mapSettingsStore.automaticTracking}
                    onChange={e => mapSettingsStore.setAutomaticTracking(e.target.checked)}
                    style={{ accentColor: '#3b82f6', width: 15, height: 15, cursor: 'pointer' }}
                />
                {t('mapControls.automaticTracking')}
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#222', userSelect: 'none' }}>
                <input
                    type="checkbox"
                    checked={mapSettingsStore.automaticFocusing}
                    onChange={e => mapSettingsStore.setAutomaticFocusing(e.target.checked)}
                    style={{ accentColor: '#3b82f6', width: 15, height: 15, cursor: 'pointer' }}
                />
                {t('mapControls.automaticFocusing')}
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#222', userSelect: 'none' }}>
                <input
                    type="checkbox"
                    checked={mapSettingsStore.satelliteView}
                    onChange={e => mapSettingsStore.setSatelliteView(e.target.checked)}
                    style={{ accentColor: '#3b82f6', width: 15, height: 15, cursor: 'pointer' }}
                />
                {t('mapControls.satelliteView')}
            </label>
        </div>
    );
});

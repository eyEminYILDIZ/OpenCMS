import { Settings, X } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { stores } from '../../../stores';

export const MapControls: React.FC = observer(() => {
    const { t } = useTranslation();
    const { mapSettingsStore } = stores;
    const [isOpen, setIsOpen] = useState(false);

    const BUTTON_BOTTOM = 56;
    const BUTTON_SIZE = 40;
    const PANEL_GAP = 8;

    return (
        <>
            <button
                onClick={() => setIsOpen(open => !open)}
                aria-label={t(isOpen ? 'mapControls.closeSettings' : 'mapControls.openSettings')}
                style={{
                    position: 'absolute',
                    bottom: BUTTON_BOTTOM,
                    left: 16,
                    zIndex: 10,
                    width: BUTTON_SIZE,
                    height: BUTTON_SIZE,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'white',
                    border: 'none',
                    borderRadius: 8,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                    cursor: 'pointer',
                    color: '#333',
                }}
            >
                <Settings size={20} />
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    bottom: BUTTON_BOTTOM + BUTTON_SIZE + PANEL_GAP,
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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#555', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                            {t('mapControls.title')}
                        </span>
                        <button
                            onClick={() => setIsOpen(false)}
                            aria-label={t('mapControls.closeSettings')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#555',
                                padding: 2,
                            }}
                        >
                            <X size={16} />
                        </button>
                    </div>

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
            )}
        </>
    );
});

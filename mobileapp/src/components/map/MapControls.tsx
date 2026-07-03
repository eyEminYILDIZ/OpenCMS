import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { stores } from '../../stores';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onMyLocation: () => void;
}

export const MapControls: React.FC<MapControlsProps> = observer(({ onZoomIn, onZoomOut, onMyLocation }) => {
  const { t } = useTranslation();
  const { mapSettingsStore, operationStore } = stores;
  const [settingsOpen, setSettingsOpen] = useState(false);
  const selectedOperationName = operationStore.selectedItem?.name;

  return (
    <View style={styles.container}>
      {settingsOpen && (
        <View style={styles.settingsPanel}>
          <View style={styles.panelHeader}>
            <Text style={styles.title}>{t('mapControls.title')}</Text>
            <TouchableOpacity onPress={() => setSettingsOpen(false)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MaterialCommunityIcons name="close" size={16} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t('mapControls.automaticTracking')}</Text>
            <Switch
              value={mapSettingsStore.automaticTracking}
              onValueChange={v => mapSettingsStore.setAutomaticTracking(v)}
              trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
              thumbColor="#ffffff"
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t('mapControls.automaticFocusing')}</Text>
            <Switch
              value={mapSettingsStore.automaticFocusing}
              onValueChange={v => mapSettingsStore.setAutomaticFocusing(v)}
              trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
              thumbColor="#ffffff"
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t('mapControls.satelliteView')}</Text>
            <Switch
              value={mapSettingsStore.satelliteView}
              onValueChange={v => mapSettingsStore.setSatelliteView(v)}
              trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>
      )}

      <View style={styles.buttons}>
        {selectedOperationName && (
          <View style={styles.operationNameButton} pointerEvents="none">
            <Text style={styles.operationNameText} numberOfLines={1}>
              {selectedOperationName}
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={[styles.button, settingsOpen && styles.buttonActive]}
          onPress={() => setSettingsOpen(v => !v)}
        >
          <MaterialCommunityIcons name="cog" size={18} color={settingsOpen ? '#3b82f6' : '#374151'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onMyLocation}>
          <MaterialCommunityIcons name="crosshairs-gps" size={18} color="#374151" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleZoomIn}>
          <Text style={styles.zoomText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleZoomOut}>
          <Text style={styles.zoomText}>−</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  function handleZoomIn() { onZoomIn(); }
  function handleZoomOut() { onZoomOut(); }
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 32,
    left: 12,
    right: 12,
    alignItems: 'flex-end',
    gap: 6,
  },
  settingsPanel: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    minWidth: 210,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 5,
    gap: 10,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6b7280',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    fontSize: 13,
    color: '#374151',
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    gap: 6,
  },
  operationNameButton: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
  },
  operationNameText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonActive: {
    backgroundColor: '#eff6ff',
  },
  zoomText: {
    fontSize: 22,
    lineHeight: 26,
    color: '#374151',
    fontWeight: '600',
  },
});

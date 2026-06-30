import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RNRestart from 'react-native-restart';
import { TextBox } from '../TextBox';
import { stores } from '../../stores';

interface SettingsEditModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SettingsEditModal: React.FC<SettingsEditModalProps> = observer(({ visible, onClose }) => {
  const { settingsStore } = stores;
  const [serverAddress, setServerAddress] = useState(settingsStore.serverAddress);

  useEffect(() => {
    if (visible) {
      setServerAddress(settingsStore.serverAddress);
    }
  }, [visible, settingsStore.serverAddress]);

  const handleSave = () => {
    const trimmed = serverAddress.trim();
    if (trimmed && trimmed !== settingsStore.serverAddress) {
      settingsStore.setServerAddress(trimmed);
      onClose();
      RNRestart.restart();
      return;
    }
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Edit Settings</Text>

          <Text style={styles.label}>Server Address</Text>
          <TextBox
            value={serverAddress}
            onChangeText={setServerAddress}
            placeholder="e.g. localhost:5010"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  dialog: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 12,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 12,
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
    marginRight: 12,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: '#F4F4F5',
  },
  cancelButtonText: {
    color: '#111827',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#18181B',
  },
  saveButtonText: {
    color: '#FAFAFA',
    fontWeight: '600',
  },
});

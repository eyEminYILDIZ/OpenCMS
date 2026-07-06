import React, { useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';
import { stores } from '../../stores';
import { PanelModes } from '../../types';

export const DispatchDeleteSheet = observer(() => {
  const { t } = useTranslation();
  const { dispatchStore } = stores;
  const [isDeleting, setIsDeleting] = useState(false);

  const visible = dispatchStore.panelMode === PanelModes.Delete;
  const selectedItem = dispatchStore.selectedItem;

  const handleClose = () => dispatchStore.setPanelMode(PanelModes.Detail);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatchStore.deleteItem();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={handleClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('dispatch.delete.title')}</Text>
            <TouchableOpacity onPress={handleClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MaterialCommunityIcons name="close" size={24} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          <Text style={styles.message}>
            {t('dispatch.delete.confirmMessage', { title: selectedItem?.title ?? '' })}
          </Text>

          <TouchableOpacity
            style={[styles.deleteButton, isDeleting && styles.deleteButtonDisabled]}
            onPress={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color={colors.destructiveForeground} />
            ) : (
              <MaterialCommunityIcons name="trash-can-outline" size={18} color={colors.destructiveForeground} />
            )}
            <Text style={styles.deleteButtonText}>
              {isDeleting ? t('common.deleting') : t('common.delete')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.cardForeground,
  },
  message: {
    fontSize: 14,
    color: colors.foreground,
    marginBottom: 20,
    lineHeight: 20,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.destructive,
    borderRadius: 8,
    paddingVertical: 14,
  },
  deleteButtonDisabled: {
    opacity: 0.6,
  },
  deleteButtonText: {
    color: colors.destructiveForeground,
    fontSize: 15,
    fontWeight: '600',
  },
});

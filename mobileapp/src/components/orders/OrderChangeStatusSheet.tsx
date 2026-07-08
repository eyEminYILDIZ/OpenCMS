import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { OperationApi } from '../../api';
import { orderStatusOptions } from '../../types/enums/OrderTypes';
import { colors } from '../../theme/colors';
import { stores } from '../../stores';
import { Dropdown } from '../ui';

interface OrderChangeStatusSheetProps {
  order: OperationApi.GetById.OrderResponse | undefined;
  onClose: () => void;
}

export const OrderChangeStatusSheet = observer(({ order, onClose }: OrderChangeStatusSheetProps) => {
  const { t } = useTranslation();
  const { operationStore } = stores;
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<OperationApi.Enums.OrderStatus | undefined>(order?.orderStatus);

  const visible = order != null;

  useEffect(() => {
    setStatus(order?.orderStatus);
  }, [order]);

  const handleSave = async () => {
    if (!order || status == null) return;
    setIsSaving(true);
    try {
      await operationStore.changeOrderStatus(order.id, status);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('operation.changeOrderStatus.title')}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MaterialCommunityIcons name="close" size={24} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>{t('operation.orderFields.orderStatus')}</Text>
          <Dropdown
            items={orderStatusOptions}
            selectedId={status != null ? String(status) : undefined}
            placeholder={t('operation.changeOrderStatus.placeholder')}
            onSelect={(id) => setStatus(Number(id) as OperationApi.Enums.OrderStatus)}
          />

          <TouchableOpacity
            style={[styles.saveButton, (isSaving || status == null) && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving || status == null}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={colors.primaryForeground} />
            ) : (
              <MaterialCommunityIcons name="content-save-outline" size={18} color={colors.primaryForeground} />
            )}
            <Text style={styles.saveButtonText}>
              {isSaving ? t('common.saving') : t('common.save')}
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
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.mutedForeground,
    marginHorizontal: 12,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 12,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: colors.primaryForeground,
    fontSize: 15,
    fontWeight: '600',
  },
});

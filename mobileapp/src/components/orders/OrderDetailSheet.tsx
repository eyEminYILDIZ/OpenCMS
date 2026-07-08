import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { OperationApi } from '../../api';
import { orderStatusLabels, orderTypeColors, orderTypeLabels } from '../../types/enums/OrderTypes';
import { colors } from '../../theme/colors';
import { DateService } from '../../services/DateService';
import { getOrderPin } from './pins/getOrderPin';

interface OrderDetailSheetProps {
  order: OperationApi.GetById.OrderResponse | undefined;
  onClose: () => void;
  onShowOnMap: (order: OperationApi.GetById.OrderResponse) => void;
  onChangeStatus: (order: OperationApi.GetById.OrderResponse) => void;
}

export const OrderDetailSheet = ({ order, onClose, onShowOnMap, onChangeStatus }: OrderDetailSheetProps) => {
  const { t } = useTranslation();

  return (
    <Modal visible={order != null} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('operation.detailOrder.title')}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MaterialCommunityIcons name="close" size={24} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          {order && (
            <View style={styles.card}>
              <Row label={t('operation.orderFields.code')} value={order.code} />
              <Row label={t('operation.orderFields.description')} value={order.description} />
              <Row
                label={t('operation.orderFields.orderType')}
                value={
                  <View style={styles.typeValue}>
                    {getOrderPin(order.orderType, { size: 16, color: orderTypeColors[order.orderType] })}
                    <Text style={styles.value}>{orderTypeLabels[order.orderType]}</Text>
                  </View>
                }
              />
              <Row label={t('operation.orderFields.orderStatus')} value={orderStatusLabels[order.orderStatus]} />
              <Row label={t('operation.orderFields.issuedDate')} value={DateService.toLocalDate(order.issuedDate)} />
              <Row label={t('operation.orderFields.completedDate')} value={DateService.toLocalDate(order.completedDate)} />
              <Row
                label={t('operation.orderFields.responsibleOperationAssetId')}
                value={order.responsibleOperationAssetName}
              />
              <Row
                label={t('operation.orderFields.previousOrderId')}
                value={order.previousOrderDescription ?? ''}
                last
              />
            </View>
          )}

          {order && (
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.showOnMapButton, styles.actionButton]}
                onPress={() => onShowOnMap(order)}
              >
                <MaterialCommunityIcons name="map-marker-outline" size={18} color={colors.primaryForeground} />
                <Text style={styles.showOnMapButtonText}>{t('operation.detailOrder.showOnMap')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.changeStatusButton, styles.actionButton]}
                onPress={() => onChangeStatus(order)}
              >
                <MaterialCommunityIcons name="progress-check" size={18} color={colors.accentForeground} />
                <Text style={styles.changeStatusButtonText}>{t('operation.detailOrder.changeStatus')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const Row = ({ label, value, last }: { label: string; value: React.ReactNode; last?: boolean }) => (
  <View style={[styles.row, !last && styles.rowDivider]}>
    <Text style={styles.label}>{label}</Text>
    {typeof value === 'string' ? <Text style={styles.value}>{value}</Text> : value}
  </View>
);

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
  card: {
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    paddingVertical: 12,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.mutedForeground,
  },
  value: {
    fontSize: 14,
    color: colors.foreground,
    flexShrink: 1,
    textAlign: 'right',
  },
  typeValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  showOnMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
  },
  showOnMapButtonText: {
    color: colors.primaryForeground,
    fontSize: 15,
    fontWeight: '600',
  },
  changeStatusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 14,
  },
  changeStatusButtonText: {
    color: colors.accentForeground,
    fontSize: 15,
    fontWeight: '600',
  },
});

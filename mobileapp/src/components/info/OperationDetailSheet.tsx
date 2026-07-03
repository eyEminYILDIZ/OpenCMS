import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { OperationApi } from '../../api';
import { operationStatusLabels, operationTypeLabels } from '../../types/enums/OperationTypes';
import { colors } from '../../theme/colors';
import { DateService } from '../../services/DateService';

interface OperationDetailSheetProps {
  operation: OperationApi.GetActivesByAgent.Response | undefined;
  isSelected: boolean;
  onClose: () => void;
  onSetSelected: (operation: OperationApi.GetActivesByAgent.Response) => void;
  onDeselect: () => void;
}

export const OperationDetailSheet = ({ operation, isSelected, onClose, onSetSelected, onDeselect }: OperationDetailSheetProps) => {
  const { t } = useTranslation();

  return (
    <Modal visible={operation != null} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('operation.detailOperation.title')}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MaterialCommunityIcons name="close" size={24} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          {operation && (
            <View style={styles.card}>
              <Row label={t('operation.fields.name')} value={operation.name} />
              <Row label={t('operation.fields.description')} value={operation.description} />
              <Row label={t('operation.fields.operationType')} value={operationTypeLabels[operation.operationType]} />
              <Row label={t('operation.fields.operationStatus')} value={operationStatusLabels[operation.operationStatus]} />
              <Row label={t('operation.fields.startDate')} value={DateService.toLocalDate(operation.startDate)} />
              <Row label={t('operation.fields.estimatedEndDate')} value={DateService.toLocalDate(operation.estimatedEndDate)} />
              <Row
                label={t('operation.fields.endDate')}
                value={operation.endDate ? DateService.toLocalDate(operation.endDate) : '-'}
                last
              />
            </View>
          )}

          {operation && (
            isSelected ? (
              <TouchableOpacity style={[styles.actionButton, styles.deselectButton]} onPress={onDeselect}>
                <MaterialCommunityIcons name="close-circle-outline" size={18} color={colors.foreground} />
                <Text style={styles.deselectButtonText}>{t('operation.detailOperation.deselectOperation')}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.actionButton} onPress={() => onSetSelected(operation)}>
                <MaterialCommunityIcons name="check-circle-outline" size={18} color={colors.primaryForeground} />
                <Text style={styles.actionButtonText}>{t('operation.detailOperation.setSelectedOperation')}</Text>
              </TouchableOpacity>
            )
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
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
  },
  actionButtonText: {
    color: colors.primaryForeground,
    fontSize: 15,
    fontWeight: '600',
  },
  deselectButton: {
    backgroundColor: colors.secondary,
  },
  deselectButtonText: {
    color: colors.secondaryForeground,
    fontSize: 15,
    fontWeight: '600',
  },
});

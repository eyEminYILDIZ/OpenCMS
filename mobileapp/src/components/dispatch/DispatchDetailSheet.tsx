import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DispatchApi } from '../../api';
import { colors } from '../../theme/colors';
import { DateService } from '../../services/DateService';
import { dispatchCategoryColors, dispatchCategoryIcons, dispatchCategoryLabels } from '../../types/enums/DispatchCategories';
import { stores } from '../../stores';
import { PanelModes } from '../../types';
import { agentId } from '../../../app.json';

interface DispatchDetailSheetProps {
  dispatch: DispatchApi.ListAll.Response | undefined;
  onClose: () => void;
}

export const DispatchDetailSheet = observer(({ dispatch, onClose }: DispatchDetailSheetProps) => {
  const { t } = useTranslation();
  const { dispatchStore } = stores;

  const isOwnDispatch = dispatch?.providerAgentId === agentId;
  const handleUpdatePress = () => dispatchStore.setPanelMode(PanelModes.Update);
  const visible = dispatch != null && dispatchStore.panelMode === PanelModes.Detail;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('dispatch.detail.title')}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MaterialCommunityIcons name="close" size={24} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          {dispatch && (
            <View style={styles.card}>
              <Row label={t('dispatch.fields.title')} value={dispatch.title} />
              <Row label={t('dispatch.fields.description')} value={dispatch.description} />
              <Row
                label={t('dispatch.fields.category')}
                value={
                  <View style={styles.categoryValue}>
                    <MaterialCommunityIcons
                      name={dispatchCategoryIcons[dispatch.category]}
                      size={16}
                      color={dispatchCategoryColors[dispatch.category]}
                    />
                    <Text style={styles.value}>{dispatchCategoryLabels[dispatch.category]}</Text>
                  </View>
                }
              />
              <Row label={t('dispatch.fields.occuredAt')} value={DateService.toLocalDate(dispatch.occuredAt)} />
              <Row label={t('dispatch.fields.providerAgent')} value={dispatch.providerAgentName} last />
            </View>
          )}

          {dispatch && isOwnDispatch && (
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdatePress}>
              <MaterialCommunityIcons name="pencil-outline" size={18} color={colors.primaryForeground} />
              <Text style={styles.updateButtonText}>{t('common.update')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
});

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
  categoryValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 4,
  },
  updateButtonText: {
    color: colors.primaryForeground,
    fontSize: 15,
    fontWeight: '600',
  },
});

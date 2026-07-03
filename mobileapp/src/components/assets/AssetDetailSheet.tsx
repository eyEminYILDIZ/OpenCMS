import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AssetApi } from '../../api';
import { assetTypeLabels } from '../../types/enums/AssetTypes';
import { threatTypeLabels } from '../../types/enums/ThreatTypes';
import { colors } from '../../theme/colors';

interface AssetDetailSheetProps {
  id: string;
  name: string;
  assetType: AssetApi.Enums.AssetTypes;
  threatType: AssetApi.Enums.ThreatTypes;
  latitude: number;
  longitude: number;
  speed: number;
  isActive: boolean;
  altitude: number;
  heading: number;
  firstUpdated: string;
  lastUpdated: string;
  onClose: () => void;
  onShowOnMap: (id: string) => void;
}

export const AssetDetailSheet = ({ id, name, assetType, threatType, latitude, longitude, speed, isActive, altitude, heading, firstUpdated, lastUpdated, onClose, onShowOnMap }: AssetDetailSheetProps) => {
  const { t } = useTranslation();

  return (
    <Modal visible={name != null} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('asset.detail.title')}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MaterialCommunityIcons name="close" size={24} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          {id && (
            <View style={styles.card}>
              <Row label={t('asset.fields.name')} value={name} />
              <Row label={t('asset.fields.assetType')} value={assetTypeLabels[assetType]} />
              <Row label={t('asset.fields.threatType')} value={threatTypeLabels[threatType]} />
              <Row label={t('asset.fields.latitude')} value={latitude.toLocaleString()} />
              <Row label={t('asset.fields.longitude')} value={longitude.toLocaleString()} />
              <Row label={t('asset.fields.speed')} value={speed.toLocaleString()} />
              <Row label={t('asset.fields.isActive')} value={isActive ? t('common.yes') : t('common.no')} last />
            </View>
          )}

          {id && (
            <TouchableOpacity style={styles.showOnMapButton} onPress={() => onShowOnMap(id)}>
              <MaterialCommunityIcons name="map-marker-outline" size={18} color={colors.primaryForeground} />
              <Text style={styles.showOnMapButtonText}>{t('asset.detail.showOnMap')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const Row = ({ label, value, last }: { label: string; value: string; last?: boolean }) => (
  <View style={[styles.row, !last && styles.rowDivider]}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
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
    marginBottom: 20,
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
});

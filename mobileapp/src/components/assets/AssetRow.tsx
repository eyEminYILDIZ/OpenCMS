import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AssetApi } from '../../api';
import { colors } from '../../theme/colors';
import { threatTypeColors } from '../../types/enums/ThreatTypes';
import { getAssetMarker } from '../map/markers/getAssetMarker';

interface AssetRowProps {
  threatType: AssetApi.Enums.ThreatTypes;
  assetType: AssetApi.Enums.AssetTypes;
  assetName: string;
}

export function AssetRow({ threatType, assetType, assetName }: AssetRowProps) {
  const color = threatTypeColors[threatType];

  return (
    <View style={styles.row}>
      <View style={styles.iconColumn}>
        {getAssetMarker(assetType, { size: 28, color })}
      </View>
      <Text style={styles.name}>{assetName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconColumn: {
    width: 32,
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
  },
});

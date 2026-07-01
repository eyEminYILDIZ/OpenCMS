import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AssetApi } from '../../api';
import { colors } from '../../theme/colors';
import { threatTypeColors } from '../../types/enums/ThreatTypes';
import { getAssetMarker } from '../map/markers/getAssetMarker';

interface AssetRowProps {
  asset: AssetApi.ListAll.Response;
}

export function AssetRow({ asset }: AssetRowProps) {
  const color = threatTypeColors[asset.threatType];

  return (
    <View style={styles.row}>
      <View style={styles.iconColumn}>
        {getAssetMarker(asset.assetType, { size: 28, color })}
      </View>
      <Text style={styles.name}>{asset.name}</Text>
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

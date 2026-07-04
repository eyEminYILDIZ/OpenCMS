import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DispatchApi } from '../../api';
import { colors } from '../../theme/colors';
import { dispatchCategoryColors, dispatchCategoryIcons } from '../../types/enums/DispatchCategories';

interface DispatchRowProps {
  dispatch: DispatchApi.ListAll.Response;
}

export function DispatchRow({ dispatch }: DispatchRowProps) {
  const color = dispatchCategoryColors[dispatch.category];

  return (
    <View style={styles.row}>
      <View style={styles.iconColumn}>
        <MaterialCommunityIcons name={dispatchCategoryIcons[dispatch.category]} size={28} color={color} />
      </View>
      <View style={styles.textColumn}>
        <Text style={styles.title} numberOfLines={1}>{dispatch.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{dispatch.description}</Text>
      </View>
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
  textColumn: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
  },
  description: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.mutedForeground,
  },
});

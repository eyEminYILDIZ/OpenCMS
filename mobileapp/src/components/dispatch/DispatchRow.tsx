import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DispatchApi } from '../../api';
import { colors } from '../../theme/colors';
import { DateService } from '../../services/DateService';
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
        <View style={styles.subtitleRow}>
          <Text style={styles.subtitle} numberOfLines={1}>{DateService.toLocalDate(dispatch.occuredAt)}</Text>
          <Text style={styles.subtitle} numberOfLines={1}>{dispatch.providerAgentName}</Text>
        </View>
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
  subtitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.mutedForeground,
  },
});

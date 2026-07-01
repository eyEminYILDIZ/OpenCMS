import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { OperationApi } from '../../api';
import { colors } from '../../theme/colors';
import { orderTypeColors, orderTypeIcons } from '../../types/enums/OrderTypes';

interface OrderRowProps {
  order: OperationApi.GetById.OrderResponse;
}

export function OrderRow({ order }: OrderRowProps) {
  const color = orderTypeColors[order.orderType];

  return (
    <View style={styles.row}>
      <View style={styles.iconColumn}>
        <MaterialCommunityIcons name={orderTypeIcons[order.orderType]} size={28} color={color} />
      </View>
      <Text style={styles.description} numberOfLines={2}>{order.description}</Text>
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
  description: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
  },
});

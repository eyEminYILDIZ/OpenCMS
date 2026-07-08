import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { OperationApi } from '../../api';
import { colors } from '../../theme/colors';
import { orderTypeColors } from '../../types/enums/OrderTypes';
import { getOrderPin } from './pins/getOrderPin';

interface OrderRowProps {
  order: OperationApi.GetById.OrderResponse;
}

export function OrderRow({ order }: OrderRowProps) {
  const color = orderTypeColors[order.orderType];

  return (
    <View style={styles.row}>
      <View style={[styles.codeBadge, { borderColor: color }]}>
        <Text style={[styles.codeText, { color }]}>{order.code}</Text>
      </View>
      <View style={styles.iconColumn}>
        {getOrderPin(order.orderType, { size: 28, color })}
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
  codeBadge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  codeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  description: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
  },
});

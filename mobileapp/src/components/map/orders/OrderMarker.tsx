import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { OperationApi } from '../../../api';
import { orderTypeColors, orderTypeIcons } from '../../../types/enums/OrderTypes';
import { colors } from '../../../theme/colors';

interface OrderMarkerProps {
  /** 3 characters to display inside the circle, e.g. 1 letter + 2 digits ("A12"). */
  code: string;
  orderType: OperationApi.Enums.OrderTypes;
  size?: number;
}

export function OrderMarker({ code, orderType, size = 36 }: OrderMarkerProps): React.ReactElement {
  const badgeSize = Math.round(size * 0.55);
  const badgeColor = orderTypeColors[orderType];

  return (
    <View style={{ width: size, height: size }}>
      <View
        style={[
          styles.circle,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        <Text style={styles.code} numberOfLines={1}>
          {code.slice(0, 3).toUpperCase()}
        </Text>
      </View>
      <View
        style={[
          styles.badge,
          {
            width: badgeSize,
            height: badgeSize,
            borderRadius: badgeSize / 2,
            borderColor: badgeColor,
            top: -badgeSize * 0.3,
            right: -badgeSize * 0.3,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={orderTypeIcons[orderType]}
          size={Math.round(badgeSize * 0.6)}
          color={badgeColor}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.mutedForeground,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 3,
  },
  code: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.cardForeground,
  },
  badge: {
    position: 'absolute',
    backgroundColor: colors.card,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 3,
  },
});

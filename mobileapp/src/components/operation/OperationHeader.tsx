import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { stores } from '../../stores';
import { colors } from '../../theme/colors';
import { operationTypeColors } from '../../types/enums/OperationTypes';
import { getOperationIcon } from './icons/getOperationIcon';

export const OperationHeader = observer(() => {
  const { operationStore } = stores;
  const { t } = useTranslation();

  if (!operationStore.selectedItem) {
    return null;
  }

  return (
    <View style={styles.header}>
      <View style={styles.icon}>
        {getOperationIcon(operationStore.selectedItem.operationType, {
          size: 24,
          color: operationTypeColors[operationStore.selectedItem.operationType],
        })}
      </View>
      <Text style={styles.operationName} numberOfLines={1} ellipsizeMode="tail">
        {t('operation.orderListHeader.operationPrefix')} {operationStore.selectedItem.name}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  icon: {
    width: 24,
    alignItems: 'center',
  },
  operationName: {
    flex: 1,
    marginRight: 12,
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
  },
});

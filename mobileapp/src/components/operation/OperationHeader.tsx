import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { stores } from '../../stores';
import { colors } from '../../theme/colors';

export const OperationHeader = observer(() => {
  const { operationStore } = stores;
  const { t } = useTranslation();

  if (!operationStore.selectedItem) {
    return null;
  }

  return (
    <View style={styles.header}>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  operationName: {
    flex: 1,
    marginRight: 12,
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
  },
});

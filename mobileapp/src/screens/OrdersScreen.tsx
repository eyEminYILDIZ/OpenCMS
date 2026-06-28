import { observer } from 'mobx-react-lite';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import DataList, { DataListColumn } from '../components/DataList';
import { Dropdown } from '../components/Dropdown';
import { stores } from '../stores';
import { OperationApi } from '../api';
import { orderStatusLabels, orderTypeLabels } from '../types/enums/OrderTypes';

export const OrdersScreen = observer(() => {
  const { operationStore } = stores;
  const { t } = useTranslation();

  const columns: DataListColumn<OperationApi.GetById.OrderResponse>[] = [
    {
      key: 'description',
      header: t('operation.orderFields.description'),
      type: 'string',
    },
    {
      key: 'orderType',
      header: t('operation.orderFields.orderType'),
      render: (value) => orderTypeLabels[value as OperationApi.Enums.OrderTypes],
    },
    {
      key: 'orderStatus',
      header: t('operation.orderFields.orderStatus'),
      render: (value) => orderStatusLabels[value as OperationApi.Enums.OrderStatus],
    },
    {
      key: 'issuedDate',
      header: t('operation.orderFields.issuedDate'),
      type: 'string',
    },
    {
      key: 'completedDate',
      header: t('operation.orderFields.completedDate'),
      type: 'string',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Dropdown
        items={operationStore.allItems.map((op) => ({ id: op.id, label: op.name }))}
        selectedId={operationStore.selectedItem?.id}
        placeholder={t('operation.selectOperation')}
        emptyText={t('operation.noOperationsFound')}
        onSelect={(id) => operationStore.getById(id)}
        onDeselect={() => operationStore.clearSelectedItems()}
      />

      <DataList
        items={operationStore.selectedItem?.orders ?? []}
        columns={columns}
        emptyText={operationStore.selectedItem == undefined
          ? t('operation.noOperationSelected')
          : t('operation.noOrdersFound')}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

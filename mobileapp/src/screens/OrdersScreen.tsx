import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DataList } from '../components/ui';
import { OrderChangeStatusSheet } from '../components/orders/OrderChangeStatusSheet';
import { OrderDetailSheet } from '../components/orders/OrderDetailSheet';
import { OrderRow } from '../components/orders/OrderRow';
import { OperationHeader } from '../components/operation/OperationHeader';
import { stores } from '../stores';
import { OperationApi } from '../api';
import { RootTabParamList } from '../navigation/BottomTabNavigator';
import { colors } from '../theme/colors';

export const OrdersScreen = observer(() => {
  const { operationStore } = stores;
  const { t } = useTranslation();
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const [selectedOrder, setSelectedOrder] = useState<OperationApi.GetById.OrderResponse | undefined>(undefined);
  const [statusChangeOrder, setStatusChangeOrder] = useState<OperationApi.GetById.OrderResponse | undefined>(undefined);

  const operation = operationStore.selectedItem;
  const totalOrdersCount = operation?.orders.length ?? 0;
  const completedOrdersCount = operation?.orders.filter(
    (order) => order.orderStatus === OperationApi.Enums.OrderStatus.Completed,
  ).length ?? 0;

  return (
    <SafeAreaView style={styles.container}>
      <OperationHeader />
      {operation && (
        <View style={styles.completionRateRow}>
          <Text style={styles.title}>Orders</Text>
          <Text style={styles.completionRate}>
            Completion: {completedOrdersCount}/{totalOrdersCount}
          </Text>
        </View>
      )}
      <DataList
        items={operation?.orders ?? []}
        renderRow={(item) => <OrderRow order={item} />}
        emptyText={operation == undefined
          ? t('operation.noOperationSelected')
          : t('operation.noOrdersFound')}
        onRowPress={setSelectedOrder}
      />
      <OrderDetailSheet
        order={selectedOrder}
        onClose={() => setSelectedOrder(undefined)}
        onShowOnMap={(order) => {
          setSelectedOrder(undefined);
          operationStore.setSelectedOrder(order);
          navigation.navigate('Map');
        }}
        onChangeStatus={(order) => {
          setSelectedOrder(undefined);
          setStatusChangeOrder(order);
        }}
      />
      <OrderChangeStatusSheet
        order={statusChangeOrder}
        onClose={() => setStatusChangeOrder(undefined)}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  completionRateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
  },
  completionRate: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.mutedForeground,
  },
});

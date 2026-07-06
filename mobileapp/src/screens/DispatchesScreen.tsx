import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DataList, TextBox } from '../components/ui';
import { DispatchCreateSheet } from '../components/dispatch/DispatchCreateSheet';
import { DispatchUpdateSheet } from '../components/dispatch/DispatchUpdateSheet';
import { DispatchDetailSheet } from '../components/dispatch/DispatchDetailSheet';
import { DispatchRow } from '../components/dispatch/DispatchRow';
import { OperationHeader } from '../components/operation/OperationHeader';
import { colors } from '../theme/colors';
import { stores } from '../stores';

export const DispatchesScreen = observer(() => {
  const { dispatchStore, operationStore } = stores;
  const { t } = useTranslation();

  useEffect(() => {
    dispatchStore.getAllItems();
  }, [dispatchStore, operationStore.selectedItem]);

  return (
    <SafeAreaView style={styles.container}>
      <OperationHeader />
      <TextBox
        value={dispatchStore.listSearchValue}
        onChangeText={(v: string) => dispatchStore.setSearchValue(v)}
        placeholder={t('common.search')}
      />
      <DataList
        items={dispatchStore.allItems}
        renderRow={(item) => <DispatchRow dispatch={item} />}
        emptyText={operationStore.selectedItem == undefined
          ? t('operation.noOperationSelected')
          : t('dispatch.noDispatchesFound')}
        onRowPress={(item) => dispatchStore.setSelectedItem(item)}
      />
      <DispatchDetailSheet
        dispatch={dispatchStore.selectedItem}
        onClose={() => dispatchStore.clearSelectedItems()}
      />
      <DispatchCreateSheet />
      <DispatchUpdateSheet />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => dispatchStore.onCreateItem()}
        accessibilityLabel={t('dispatch.create.title')}
      >
        <MaterialCommunityIcons name="plus" size={26} color={colors.primaryForeground} />
      </TouchableOpacity>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
});

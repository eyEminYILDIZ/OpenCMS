import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DataList, TextBox } from '../components/ui';
import { DispatchDetailSheet } from '../components/dispatch/DispatchDetailSheet';
import { DispatchRow } from '../components/dispatch/DispatchRow';
import { OperationHeader } from '../components/operation/OperationHeader';
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
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

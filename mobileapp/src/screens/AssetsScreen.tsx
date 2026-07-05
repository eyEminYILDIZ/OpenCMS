import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { observer } from 'mobx-react-lite';
import React, { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { DataList, TextBox } from '../components/ui';
import { AssetDetailSheet } from '../components/assets/AssetDetailSheet';
import { AssetRow } from '../components/assets/AssetRow';
import { OperationHeader } from '../components/operation/OperationHeader';
import { stores } from '../stores';
import { AssetApi, OperationApi } from '../api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootTabParamList } from '../navigation/BottomTabNavigator';

export const AssetsScreen = observer(() => {
  const { assetStore, operationStore } = stores;
  const { t } = useTranslation();
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const operationAssets: OperationApi.GetById.OperationAssetResponse[] = useMemo(() => {
    if (operationStore.selectedItem != undefined) {
      return operationStore.selectedItem.operationAssets.filter((asset) => asset.asset.name.includes(assetStore.listSearchValue));
    }
    return [];
  }, [operationStore.selectedItem, assetStore.listSearchValue]);

  return (
    <SafeAreaView style={styles.container}>
      <OperationHeader />
      <TextBox
        value={assetStore.listSearchValue}
        onChangeText={(v: string) => {
          if (operationStore.selectedItem != undefined) {
            assetStore.setSearchValue(v);
          } else {
            assetStore.setSearchValue(v);
          }
        }}
        placeholder={t('common.search')}
      />
      {operationStore.selectedItem == undefined && (
        <>
          <DataList
            items={assetStore.allItems}
            renderRow={(item) => <AssetRow threatType={item.threatType} assetType={item.assetType} assetName={item.name} />}
            emptyText={t('asset.noAssetsFound')}
            onRowPress={(item) => assetStore.setSelectedItem(item)}
          />
          {assetStore.selectedItem && (
            <AssetDetailSheet
              id={assetStore.selectedItem.id}
              name={assetStore.selectedItem.name}
              assetType={assetStore.selectedItem.assetType}
              threatType={assetStore.selectedItem.threatType}
              latitude={assetStore.selectedItem.latitude}
              longitude={assetStore.selectedItem.longitude}
              speed={assetStore.selectedItem.speed}
              isActive={assetStore.selectedItem.isActive}
              altitude={assetStore.selectedItem.altitude}
              heading={assetStore.selectedItem.heading}
              firstUpdated={assetStore.selectedItem.firstUpdated}
              lastUpdated={assetStore.selectedItem.lastUpdated}
              onClose={() => assetStore.setSelectedItem(undefined)}
              onShowOnMap={(id) => {
                navigation.navigate('Map');
              }}
            />
          )}
        </>
      )}
      {operationStore.selectedItem != undefined && (
        <>
          <DataList
            items={operationAssets}
            renderRow={(item) => <AssetRow threatType={item.asset.threatType} assetType={item.asset.assetType} assetName={item.asset.name} />}
            emptyText={t('asset.noAssetsFound')}
            onRowPress={(item) => operationStore.setSelectedAsset(item)}
          />
          {operationStore.selectedAsset && (
            <AssetDetailSheet
              id={operationStore.selectedAsset.asset.id}
              name={operationStore.selectedAsset.asset.name}
              assetType={operationStore.selectedAsset.asset.assetType}
              threatType={operationStore.selectedAsset.asset.threatType}
              latitude={operationStore.selectedAsset.asset.latitude}
              longitude={operationStore.selectedAsset.asset.longitude}
              speed={operationStore.selectedAsset.asset.speed}
              isActive={operationStore.selectedAsset.asset.isActive}
              altitude={operationStore.selectedAsset.asset.altitude}
              heading={operationStore.selectedAsset.asset.heading}
              firstUpdated={operationStore.selectedAsset.asset.firstUpdated}
              lastUpdated={operationStore.selectedAsset.asset.lastUpdated}
              onClose={() => operationStore.setSelectedAsset(undefined)}
              onShowOnMap={(id) => {
                navigation.navigate('Map');
              }}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

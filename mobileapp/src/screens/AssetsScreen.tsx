import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import DataList, { DataListColumn } from '../components/DataList';
import { TextBox } from '../components/TextBox';
import { AssetDetailSheet } from '../components/assets/AssetDetailSheet';
import { stores } from '../stores';
import { AssetApi } from '../api';
import { assetTypeLabels } from '../types/enums/AssetTypes';
import { threatTypeLabels } from '../types/enums/ThreatTypes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootTabParamList } from '../navigation/BottomTabNavigator';

export const AssetsScreen = observer(() => {
  const { assetStore } = stores;
  const { t } = useTranslation();
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const [selectedAsset, setSelectedAsset] = useState<AssetApi.ListAll.Response | undefined>(undefined);
  const columns: DataListColumn<AssetApi.ListAll.Response>[] = [
    {
      key: 'name',
      header: t('asset.fields.name'),
      type: 'string'
    },
    {
      key: 'assetType',
      header: t('asset.fields.assetType'),
      render: (value) => assetTypeLabels[value as AssetApi.Enums.AssetTypes]
    },
    {
      key: 'threatType',
      header: t('asset.fields.threatType'),
      render: (value) => threatTypeLabels[value as AssetApi.Enums.ThreatTypes]
    },
    {
      key: 'latitude',
      header: t('asset.fields.latitude'),
      type: 'number'
    },
    {
      key: 'longitude',
      header: t('asset.fields.longitude'),
      type: 'number'
    },
    {
      key: 'speed',
      header: t('asset.fields.speed'),
      type: 'number'
    },
    {
      key: 'isActive',
      header: t('asset.fields.isActive'),
      render: (value) => (value ? t('common.yes') : t('common.no'))
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <TextBox
        value={assetStore.listSearchValue}
        onChangeText={(v: string) => {
          assetStore.setSearchValue(v);
        }}
        placeholder={t('common.search')}
      />
      <DataList
        items={assetStore.allItems}
        columns={columns}
        emptyText={t('asset.noAssetsFound')}
        onRowPress={setSelectedAsset}
      />
      <AssetDetailSheet
        asset={selectedAsset}
        onClose={() => setSelectedAsset(undefined)}
        onShowOnMap={(asset) => {
          setSelectedAsset(undefined);
          assetStore.setSelectedItem(asset);
          navigation.navigate('Map');
        }}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

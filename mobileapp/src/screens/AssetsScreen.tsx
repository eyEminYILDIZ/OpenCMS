import { observer } from 'mobx-react-lite';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import DataList, { DataListColumn } from '../components/DataList';
import { stores } from '../stores';
import { AssetApi } from '../api';
import { assetTypeLabels } from '../types/enums/AssetTypes';
import { threatTypeLabels } from '../types/enums/ThreatTypes';
import { colors } from '../theme/colors';

export const AssetsScreen = observer(() => {
  const { assetStore } = stores;
  const { t } = useTranslation();
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
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        value={assetStore.searchValue}
        onChangeText={(v) => {
          assetStore.setSearchValue(v);
          assetStore.getAllItems(v);
        }}
        placeholder={t('common.search')}
        placeholderTextColor={colors.mutedForeground}
        clearButtonMode="while-editing"
      />
      <DataList
        items={assetStore.allItems}
        columns={columns}
        emptyText={t('asset.noAssetsFound')}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    margin: 12,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    fontSize: 18,
    color: colors.foreground,
    backgroundColor: colors.background,
  },
});

import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import DataList from '../components/DataList';
import { TextBox } from '../components/TextBox';
import { AssetDetailSheet } from '../components/assets/AssetDetailSheet';
import { AssetRow } from '../components/assets/AssetRow';
import { stores } from '../stores';
import { AssetApi } from '../api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootTabParamList } from '../navigation/BottomTabNavigator';

export const AssetsScreen = observer(() => {
  const { assetStore } = stores;
  const { t } = useTranslation();
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const [selectedAsset, setSelectedAsset] = useState<AssetApi.ListAll.Response | undefined>(undefined);

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
        renderRow={(item) => <AssetRow asset={item} />}
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

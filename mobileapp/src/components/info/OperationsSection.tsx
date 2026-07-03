import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { stores } from '../../stores';
import { OperationApi } from '../../api';
import { operationTypeLabels } from '../../types/enums/OperationTypes';
import { OperationDetailSheet } from './OperationDetailSheet';

export const OperationsSection = observer(() => {
  const { operationStore, assetStore, agentStore } = stores;
  const { t } = useTranslation();
  const [detailItem, setDetailItem] = useState<OperationApi.GetActivesByAgent.Response | undefined>(undefined);

  const handleSetSelectedOperation = (item: OperationApi.GetActivesByAgent.Response) => {
    operationStore.getById(item.id);
    assetStore.clearSelectedItems();
    setDetailItem(undefined);
  };

  const handleDeselectOperation = () => {
    operationStore.clearSelectedItems();
    assetStore.clearSelectedItems();
    setDetailItem(undefined);
  };

  return (
    <View style={styles.section}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Participated Operations</Text>
      </View>

      <View style={styles.card}>
        {operationStore.allItems.length === 0 ? (
          <Text style={styles.emptyText}>{t('operation.noOperationsFound')}</Text>
        ) : (
          <FlatList
            data={operationStore.allItems}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            extraData={operationStore.selectedItem?.id}
            renderItem={({ item }) => (
              <OperationRow
                item={item}
                isSelected={operationStore.selectedItem?.id === item.id}
                onPress={() => setDetailItem(item)}
              />
            )}
          />
        )}
      </View>

      <OperationDetailSheet
        operation={detailItem}
        isSelected={detailItem != null && operationStore.selectedItem?.id === detailItem.id}
        onClose={() => setDetailItem(undefined)}
        onSetSelected={handleSetSelectedOperation}
        onDeselect={handleDeselectOperation}
      />
    </View>
  );
});

const OperationRow = ({
  item,
  isSelected,
  onPress,
}: {
  item: OperationApi.GetActivesByAgent.Response;
  isSelected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.row} onPress={onPress}>
    <View style={styles.rowLeft}>
      <Text style={[styles.rowName, isSelected && styles.rowNameSelected]}>{item.name}</Text>
      <Text style={styles.rowType}>{operationTypeLabels[item.operationType]}</Text>
    </View>
    {isSelected && (
      <MaterialCommunityIcons name="check-circle" size={18} color="#10B981" />
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginLeft: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  rowLeft: {
    flex: 1,
    gap: 2,
  },
  rowName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  rowNameSelected: {
    color: '#10B981',
  },
  rowType: {
    fontSize: 12,
    color: '#6B7280',
  },
});

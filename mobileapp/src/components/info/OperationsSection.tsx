import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { stores } from '../../stores';
import { OperationApi } from '../../api';
import { operationTypeLabels } from '../../types/enums/OperationTypes';

export const OperationsSection = observer(() => {
  const { operationStore } = stores;
  const { t } = useTranslation();
  const [selectVisible, setSelectVisible] = useState(false);
  const [pendingId, setPendingId] = useState<string | undefined>(undefined);

  const handleOpen = () => {
    setPendingId(operationStore.selectedItem?.id);
    setSelectVisible(true);
  };

  const handleSave = () => {
    if (pendingId) {
      operationStore.getById(pendingId);
    } else {
      operationStore.clearSelectedItems();
    }
    setSelectVisible(false);
  };

  const handleCancel = () => {
    setSelectVisible(false);
  };

  return (
    <View style={styles.section}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Participated Operations</Text>
        <TouchableOpacity
          onPress={handleOpen}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialCommunityIcons name="pencil" size={20} color="#6B7280" />
        </TouchableOpacity>
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
              <OperationRow item={item} isSelected={operationStore.selectedItem?.id === item.id} />
            )}
          />
        )}
      </View>

      <Modal visible={selectVisible} transparent animationType="fade" onRequestClose={handleCancel}>
        <View style={styles.overlay}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>{t('operation.selectOperation')}</Text>
            <FlatList
              data={operationStore.allItems}
              keyExtractor={(item) => item.id}
              style={styles.list}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.listItem, pendingId === item.id && styles.listItemSelected]}
                  onPress={() => setPendingId(pendingId === item.id ? undefined : item.id)}
                >
                  <Text style={[styles.listItemText, pendingId === item.id && styles.listItemTextSelected]}>
                    {item.name}
                  </Text>
                  {pendingId === item.id && (
                    <MaterialCommunityIcons name="check" size={18} color="#10B981" />
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>{t('operation.noOperationsFound')}</Text>}
            />
            <View style={styles.actions}>
              {pendingId !== undefined ? (
                <TouchableOpacity style={[styles.button, styles.deselectButton]} onPress={() => setPendingId(undefined)}>
                  <Text style={styles.deselectButtonText}>DeSelect</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.button} />
              )}
              <View style={styles.actionsRight}>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                  <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>{t('common.save')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
});

const OperationRow = ({ item, isSelected }: { item: OperationApi.GetActivesByAgent.Response; isSelected: boolean }) => (
  <View style={styles.row}>
    <View style={styles.rowLeft}>
      <Text style={[styles.rowName, isSelected && styles.rowNameSelected]}>{item.name}</Text>
      <Text style={styles.rowType}>{operationTypeLabels[item.operationType]}</Text>
    </View>
    {isSelected && (
      <MaterialCommunityIcons name="check-circle" size={18} color="#10B981" />
    )}
  </View>
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  dialog: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingTop: 20,
    paddingBottom: 8,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 16,
    marginBottom: 8,
  },
  list: {
    maxHeight: 300,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  listItemSelected: {
    backgroundColor: '#F0FDF4',
  },
  listItemText: {
    fontSize: 15,
    color: '#111827',
  },
  listItemTextSelected: {
    fontWeight: '600',
    color: '#10B981',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
  },
  actionsRight: {
    flexDirection: 'row',
    gap: 8,
  },
  deselectButton: {
    backgroundColor: '#F4F4F5',
  },
  deselectButtonText: {
    color: '#111827',
    fontWeight: '500',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: '#F4F4F5',
  },
  cancelButtonText: {
    color: '#111827',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#18181B',
  },
  saveButtonText: {
    color: '#FAFAFA',
    fontWeight: '600',
  },
});

import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';

export interface DropdownItem {
  id: string;
  label: string;
}

interface DropdownProps {
  items: DropdownItem[];
  selectedId?: string;
  placeholder?: string;
  emptyText?: string;
  onSelect: (id: string) => void;
  onDeselect?: () => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  items,
  selectedId,
  placeholder = '',
  emptyText = '',
  onSelect,
  onDeselect,
}) => {
  const [open, setOpen] = useState(false);

  const selectedItem = items.find((item) => item.id === selectedId);

  return (
    <>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        <Text
          style={[styles.dropdownText, !selectedItem && styles.placeholder]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        {selectedItem && onDeselect ? (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onDeselect();
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.clearButton}>✕</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.chevron}>▾</Text>
        )}
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View style={styles.dropdownList}>
            <FlatList
              data={items}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.dropdownItem,
                    item.id === selectedId && styles.dropdownItemSelected,
                  ]}
                  onPress={() => {
                    onSelect(item.id);
                    setOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      item.id === selectedId && styles.dropdownItemTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>{emptyText}</Text>
              }
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
    marginBottom: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    backgroundColor: colors.background,
  },
  dropdownText: {
    flex: 1,
    fontSize: 20,
    color: colors.foreground,
  },
  placeholder: {
    color: colors.mutedForeground,
  },
  chevron: {
    fontSize: 20,
    color: colors.mutedForeground,
    marginLeft: 8,
  },
  clearButton: {
    fontSize: 18,
    color: colors.mutedForeground,
    marginLeft: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
    paddingTop: 80,
  },
  dropdownList: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    maxHeight: 300,
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  dropdownItemSelected: {
    backgroundColor: colors.mutedForeground + '22',
  },
  dropdownItemText: {
    fontSize: 18,
    color: colors.foreground,
  },
  dropdownItemTextSelected: {
    fontWeight: '600',
  },
  emptyText: {
    padding: 12,
    fontSize: 14,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
});

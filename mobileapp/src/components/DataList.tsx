import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../theme/colors';

type ColumnType = 'string' | 'number' | 'button';
type ColumnKey<T> = keyof T | 'edit' | 'delete' | 'go';

interface BaseColumn<T> {
  key: ColumnKey<T>;
  header?: string;
  type?: ColumnType;
}

interface DataColumn<T> extends BaseColumn<T> {
  type?: 'string' | 'number';
  render?: (value: T[keyof T], item: T) => React.ReactNode;
}

interface ButtonColumn<T> extends BaseColumn<T> {
  type: 'button';
  icon: React.ReactNode;
  onButtonClick: (item: T) => void;
}

export type DataListColumn<T> = DataColumn<T> | ButtonColumn<T>;

interface DataListProps<T extends object> {
  items: T[];
  endpoint: (search: string) => void | Promise<void>;
  columns: DataListColumn<T>[];
  search?: boolean;
  emptyText?: string;
  onRowPress?: (item: T) => void;
}

function DataList<T extends object>({
  items,
  endpoint,
  columns,
  search = false,
  emptyText = 'No data',
  onRowPress,
}: DataListProps<T>) {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetch = useCallback(
    async (query: string) => {
      setLoading(true);
      try {
        await endpoint(query);
      } finally {
        setLoading(false);
      }
    },
    [endpoint],
  );

  useEffect(() => {
    fetch('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearchChange = (text: string) => {
    setSearchText(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetch(text), 300);
  };

  const dataColumns = columns.filter(c => c.type !== 'button') as DataColumn<T>[];
  const buttonColumns = columns.filter(c => c.type === 'button') as ButtonColumn<T>[];

  const renderCard = ({ item }: { item: T }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onRowPress?.(item)}
      activeOpacity={onRowPress ? 0.7 : 1}
    >
      <View style={styles.cardFields}>
        {dataColumns.map((col, i) => {
          const value = col.key in item ? item[col.key as keyof T] : undefined;
          const display = col.render
            ? col.render(value as T[keyof T], item)
            : col.type === 'number'
              ? Number(value).toLocaleString()
              : String(value ?? '');

          return (
            <View key={`${String(col.key)}-${i}`} style={styles.field}>
              {col.header ? <Text style={styles.fieldLabel}>{col.header}</Text> : null}
              {typeof display === 'string' || typeof display === 'number' ? (
                <Text style={styles.fieldValue}>{display}</Text>
              ) : (
                display
              )}
            </View>
          );
        })}
      </View>

      {buttonColumns.length > 0 && (
        <View style={styles.cardActions}>
          {buttonColumns.map((col, i) => (
            <TouchableOpacity
              key={`btn-${i}`}
              style={styles.actionButton}
              onPress={() => col.onButtonClick(item)}
            >
              {col.icon}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {search && (
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={onSearchChange}
          placeholder="Search..."
          placeholderTextColor={colors.mutedForeground}
          clearButtonMode="while-editing"
        />
      )}
      {loading && items.length === 0 ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(_, index) => String(index)}
          renderItem={renderCard}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyRow}>
              <Text style={styles.emptyText}>{emptyText}</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.muted,
  },
  searchInput: {
    margin: 12,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    fontSize: 14,
    color: colors.foreground,
    backgroundColor: colors.background,
  },
  loader: {
    marginTop: 40,
  },
  listContent: {
    padding: 12,
    gap: 10,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cardFields: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  field: {
    minWidth: '40%',
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 13,
    color: colors.foreground,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 10,
    alignItems: 'center',
  },
  actionButton: {
    padding: 6,
  },
  emptyRow: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
});

export default DataList;

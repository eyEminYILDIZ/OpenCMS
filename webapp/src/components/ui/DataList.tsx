import { cn } from '../../lib/utils';
import React from 'react';

type ColumnType = 'string' | 'number' | 'button';

type ColumnKey<T> = keyof T | 'edit' | 'delete';

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

interface DataListProps<T> {
  items: T[];
  columns: DataListColumn<T>[];
  className?: string;
  emptyText?: string;
  onRowClicked?: (item: T) => void;
}

function DataList<T extends object>({ items, columns, className, emptyText = 'No data', onRowClicked }: DataListProps<T>) {
  return (
    <div className={cn('table-wrapper', className)}>
      <table className="table">
        <thead className="table-header">
          <tr className="table-header-row">
            {columns.map((col, i) => (
              <th key={`${String(col.key)}-${i}`} className="table-head">
                {col.header ?? ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table-body">
          {items.length === 0 ? (
            <tr className="table-row">
              <td className="table-empty" colSpan={columns.length}>
                {emptyText}
              </td>
            </tr>
          ) : (
            items.map((item, rowIndex) => (
              <tr key={rowIndex} className={cn('table-row', onRowClicked && 'cursor-pointer')} onClick={() => onRowClicked?.(item)}>
                {columns.map((col, colIndex) => {
                  if (col.type === 'button') {
                    return (
                      <td key={`${String(col.key)}-${colIndex}`} className="table-cell" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => col.onButtonClick(item)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                          {col.icon}
                        </button>
                      </td>
                    );
                  }
                  const value = (col.key in item) ? item[col.key as keyof T] : undefined;
                  return (
                    <td key={`${String(col.key)}-${colIndex}`} className="table-cell">
                      {col.render
                        ? col.render(value as T[keyof T], item)
                        : col.type === 'number'
                          ? Number(value).toLocaleString()
                          : String(value ?? '')}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataList;

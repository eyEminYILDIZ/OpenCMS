import { cn } from '../../lib/utils';

type ColumnType = 'string' | 'number';

export interface DataListColumn<T> {
  key: keyof T;
  header: string;
  type?: ColumnType;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
}

interface DataListProps<T> {
  items: T[];
  columns: DataListColumn<T>[];
  className?: string;
  emptyText?: string;
}

function DataList<T extends object>({ items, columns, className, emptyText = 'No data' }: DataListProps<T>) {
  return (
    <div className={cn('table-wrapper', className)}>
      <table className="table">
        <thead className="table-header">
          <tr className="table-header-row">
            {columns.map((col) => (
              <th key={String(col.key)} className="table-head">
                {col.header}
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
              <tr key={rowIndex} className="table-row">
                {columns.map((col) => {
                  const value = item[col.key];
                  return (
                    <td key={String(col.key)} className="table-cell">
                      {col.render
                        ? col.render(value, item)
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

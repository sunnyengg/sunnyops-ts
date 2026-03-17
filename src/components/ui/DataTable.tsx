import React, { useState, useMemo } from 'react';
import { Button } from './Button';
import { colors, fonts } from '@/styles/tokens';

export interface Column<T> {
  header: string;
  key?: keyof T | string;
  render?: (item: T, index: number) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
  width?: string | number;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onRowClick?: (item: T) => void;
  rowStyle?: (item: T) => React.CSSProperties;
  emptyMessage?: string;
  pageSizeOptions?: number[];
  initialPageSize?: number;
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  onRowClick,
  rowStyle,
  emptyMessage = 'No records found',
  pageSizeOptions = [10, 25, 50, 100],
  initialPageSize = 25
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalRecords = data.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize]);

  // Reset to first page when data or page size changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [data.length, pageSize]);

  const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalRecords);

  return (
    <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: colors.slate50, borderBottom: `2px solid ${colors.border}` }}>
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  style={{ 
                    padding: '12px 14px', 
                    textAlign: col.align || 'left', 
                    fontSize: 9, 
                    color: colors.textSecondary, 
                    fontFamily: fonts.mono, 
                    fontWeight: 700, 
                    letterSpacing: 1, 
                    whiteSpace: 'nowrap',
                    width: col.width
                  }}
                >
                  {col.header.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: 40, textAlign: 'center' }}>
                  <div style={{ color: colors.textMuted, fontSize: 11 }}>Loading data...</div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: 32, textAlign: 'center', color: colors.textMuted }}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item, rowIdx) => (
                <tr 
                  key={rowIdx} 
                  onClick={() => onRowClick?.(item)}
                  style={{ 
                    borderBottom: `1px solid ${colors.borderLight}`, 
                    cursor: onRowClick ? 'pointer' : 'default',
                    ...(rowStyle ? rowStyle(item) : {})
                  }}
                >
                  {columns.map((col, colIdx) => (
                    <td 
                      key={colIdx} 
                      style={{ 
                        padding: '10px 14px', 
                        textAlign: col.align || 'left',
                        verticalAlign: 'middle'
                      }}
                    >
                      {col.render ? col.render(item, (currentPage - 1) * pageSize + rowIdx) : (col.key ? (item[col.key as keyof T] as any) : null)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div style={{ 
        padding: '12px 16px', 
        borderTop: `1px solid ${colors.border}`, 
        background: colors.slate50,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div style={{ fontSize: 11, color: colors.textSecondary, fontWeight: 500 }}>
          Showing <span style={{ color: colors.textPrimary, fontWeight: 700 }}>{startRecord}</span> to <span style={{ color: colors.textPrimary, fontWeight: 700 }}>{endRecord}</span> of <span style={{ color: colors.textPrimary, fontWeight: 700 }}>{totalRecords}</span> records
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, color: colors.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>Per Page</span>
            <select 
              value={pageSize} 
              onChange={e => setPageSize(Number(e.target.value))}
              style={{ padding: '4px 8px', border: `1px solid ${colors.border}`, borderRadius: 4, fontSize: 11, background: colors.surface }}
            >
              {pageSizeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', gap: 4 }}>
            <Button 
              variant="ghost" 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(p => p - 1)}
              style={{ padding: '4px 10px', fontSize: 10 }}
            >
              Previous
            </Button>
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 8, paddingRight: 8, fontSize: 11, fontWeight: 700, color: colors.brand }}>
              {currentPage} / {totalPages || 1}
            </div>
            <Button 
              variant="ghost" 
              disabled={currentPage === totalPages || totalPages === 0} 
              onClick={() => setCurrentPage(p => p + 1)}
              style={{ padding: '4px 10px', fontSize: 10 }}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from './EmptyState'
import { FileSearch } from 'lucide-react'

export function DataTable({
  columns,
  data = [],
  loading,
  emptyTitle = 'No data found',
  emptyDescription = 'Try adjusting your filters or search query.',
  onRowClick,
  rowKey = 'id',
}) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="space-y-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 border-b border-slate-100 p-4">
              {columns.map((col) => (
                <Skeleton key={col.key} className="h-4 flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!data.length) {
    return (
      <EmptyState
        icon={FileSearch}
        title={emptyTitle}
        description={emptyDescription}
      />
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500"
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => col.onSort?.(col.key)}
                      className="inline-flex items-center gap-1 hover:text-slate-700"
                    >
                      {col.header}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={row[rowKey] ?? row.claimId ?? idx}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-slate-100 transition-colors last:border-0 ${
                  onRowClick ? 'cursor-pointer hover:bg-brand-50/50' : ''
                }`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-slate-700">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

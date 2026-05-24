import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function Pagination({ page, totalPages, totalCount, onPageChange }) {
  if (totalPages <= 1 && (totalCount == null || totalCount === 0)) return null

  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-sm text-slate-500">
        {totalCount != null
          ? `${totalCount} claim${totalCount === 1 ? '' : 's'} · Page ${page} of ${totalPages}`
          : `Page ${page} of ${totalPages}`}
      </p>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

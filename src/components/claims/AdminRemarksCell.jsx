import { getAdminRemarks } from '@/services/claims'
import { cn } from '@/utils/cn'

export function AdminRemarksCell({ claim, className }) {
  const remarks = getAdminRemarks(claim)

  if (!remarks) {
    return <span className="text-slate-400">—</span>
  }

  return (
    <span
      className={cn('block max-w-[200px] truncate text-sm text-slate-600', className)}
      title={remarks}
    >
      {remarks}
    </span>
  )
}

export function AdminRemarksBlock({ claim, className }) {
  const remarks = getAdminRemarks(claim)

  if (!remarks) return null

  return (
    <div className={cn('flex gap-3 rounded-lg bg-slate-50 p-4', className)}>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-700">Admin remarks</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">{remarks}</p>
      </div>
    </div>
  )
}

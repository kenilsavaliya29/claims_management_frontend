import { cva } from 'class-variance-authority'
import { cn } from '@/utils/cn'
import { CLAIM_STATUSES } from '@/utils/constants'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide',
  {
    variants: {
      variant: {
        default: 'bg-slate-100 text-slate-700',
        pending: 'bg-amber-100 text-amber-800',
        approved: 'bg-emerald-100 text-emerald-800',
        rejected: 'bg-red-100 text-red-800',
        review: 'bg-blue-100 text-blue-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const statusVariantMap = {
  [CLAIM_STATUSES.PENDING]: 'pending',
  [CLAIM_STATUSES.APPROVED]: 'approved',
  [CLAIM_STATUSES.REJECTED]: 'rejected',
  [CLAIM_STATUSES.UNDER_REVIEW]: 'review',
}

export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export function StatusBadge({ status }) {
  const variant = statusVariantMap[status] || 'default'
  const label = status?.replace(/_/g, ' ') ?? 'Unknown'
  return <Badge variant={variant}>{label}</Badge>
}

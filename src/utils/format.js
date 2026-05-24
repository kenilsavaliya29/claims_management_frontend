import { format, parseISO, isValid } from 'date-fns'

export function formatCurrency(amount) {
  if (amount == null || Number.isNaN(Number(amount))) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(amount))
}

export function formatDate(value, pattern = 'MMM d, yyyy') {
  if (!value) return '—'
  try {
    const date = typeof value === 'string' ? parseISO(value) : new Date(value)
    if (!isValid(date)) return '—'
    return format(date, pattern)
  } catch {
    return '—'
  }
}

export function formatDateTime(value) {
  return formatDate(value, 'MMM d, yyyy h:mm a')
}

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8085'

export const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
}

export const CLAIM_STATUSES = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
}

export const ADMIN_UPDATE_STATUSES = [
  CLAIM_STATUSES.APPROVED,
  CLAIM_STATUSES.REJECTED,
  CLAIM_STATUSES.UNDER_REVIEW,
]

export const CLAIM_TYPES = [
  'HEALTH',
  'MOTOR',
  'TRAVEL',
  'ACCIDENT',
  'AUTO',
  'HOME',
  'LIFE',
  'OTHER',
]

export const CLAIM_SORT_FIELDS = [
  { value: 'createdAt', label: 'Created date' },
  { value: 'incidentDate', label: 'Incident date' },
  { value: 'amount', label: 'Amount' },
  { value: 'title', label: 'Title' },
  { value: 'status', label: 'Status' },
]

/** Quick-filter chips shown on the claims list toolbar */
export const CLAIM_QUICK_FILTERS = [
  { key: 'status', value: 'PENDING', label: 'Pending' },
  { key: 'status', value: 'APPROVED', label: 'Approved' },
  { key: 'claimType', value: 'HEALTH', label: 'Health' },
]

export const STORAGE_KEYS = {
  TOKEN: 'claimguard_token',
  ROLE: 'claimguard_role',
  NAME: 'claimguard_name',
  EMAIL: 'claimguard_email',
}

/**
 * Query params for GET /admin/claims and GET /claim/my:
 * - page (0-based)
 * - size
 * - search
 * - status
 * - claimType
 * - sortBy
 * - sortDirection (asc | desc)
 * - minAmount
 * - maxAmount
 * - fromDate (YYYY-MM-DD)
 * - toDate (YYYY-MM-DD)
 */

export const DEFAULT_CLAIM_FILTERS = {
  search: '',
  status: '',
  claimType: '',
  sortBy: 'createdAt',
  sortDirection: 'desc',
  minAmount: '',
  maxAmount: '',
  fromDate: '',
  toDate: '',
}

export function buildClaimsQueryParams({ page = 0, size = 10, filters = {} } = {}) {
  const params = { page, size }

  const search = filters.search?.trim()
  if (search) params.search = search

  if (filters.status) params.status = filters.status
  if (filters.claimType) params.claimType = filters.claimType
  if (filters.sortBy) params.sortBy = filters.sortBy
  if (filters.sortDirection) params.sortDirection = filters.sortDirection

  if (filters.minAmount !== '' && filters.minAmount != null) {
    params.minAmount = Number(filters.minAmount)
  }
  if (filters.maxAmount !== '' && filters.maxAmount != null) {
    params.maxAmount = Number(filters.maxAmount)
  }
  if (filters.fromDate) params.fromDate = filters.fromDate
  if (filters.toDate) params.toDate = filters.toDate

  return params
}

export function countActiveClaimFilters(filters = {}) {
  let count = 0
  if (filters.search?.trim()) count += 1
  if (filters.status) count += 1
  if (filters.claimType) count += 1
  if (filters.minAmount !== '' && filters.minAmount != null) count += 1
  if (filters.maxAmount !== '' && filters.maxAmount != null) count += 1
  if (filters.fromDate) count += 1
  if (filters.toDate) count += 1
  if (filters.sortBy && filters.sortBy !== 'createdAt') count += 1
  if (filters.sortDirection && filters.sortDirection !== 'desc') count += 1
  return count
}

import { unwrapApiData } from './apiError'

/** GET /claim/my → { success, data: Claim[] } */
export function normalizeClaimsResponse(response) {
  const data = unwrapApiData(response)
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.claims)) return data.claims
  return []
}

/** GET /admin/claims or GET /claim/my (paginated) → claims + pagination meta */
export function normalizeClaimsPageResponse(response) {
  const data = unwrapApiData(response) ?? {}
  const claims = Array.isArray(data.claims) ? data.claims : []
  const totalItems = Number(data.totalItems) || 0
  const totalPages = Number(data.totalPages) || 0
  const currentPage = Number.isFinite(Number(data.currentPage))
    ? Number(data.currentPage)
    : 0
  const last = Boolean(data.last)

  return {
    claims,
    totalItems,
    totalPages: totalPages > 0 ? totalPages : 1,
    currentPage,
    last,
  }
}

/** @deprecated Use normalizeClaimsPageResponse */
export const normalizeAdminClaimsPageResponse = normalizeClaimsPageResponse

export function getClaimantEmail(claim) {
  return claim?.createdBy ?? claim?.userEmail ?? claim?.email ?? claim?.claimantEmail ?? '—'
}

/** Admin review notes (approve/reject/review). */
export function getAdminRemarks(claim) {
  const value = claim?.adminRemarks ?? claim?.admin_remarks ?? claim?.remarks
  const trimmed = typeof value === 'string' ? value.trim() : ''
  return trimmed || null
}

export function filterClaims(claims, { search = '', status = 'ALL' } = {}) {
  let result = [...claims]
  const q = search.trim().toLowerCase()

  if (q) {
    result = result.filter(
      (c) =>
        String(c.claimId ?? c.id ?? '').toLowerCase().includes(q) ||
        String(c.title ?? '').toLowerCase().includes(q) ||
        String(getClaimantEmail(c)).toLowerCase().includes(q) ||
        String(c.claimType ?? '').toLowerCase().includes(q)
    )
  }

  if (status && status !== 'ALL') {
    result = result.filter((c) => c.status === status)
  }

  return result
}

export function sortClaims(claims, field = 'createdAt', direction = 'desc') {
  const sorted = [...claims]
  const dir = direction === 'asc' ? 1 : -1

  sorted.sort((a, b) => {
    let aVal = a[field]
    let bVal = b[field]

    if (field === 'createdAt' || field === 'incidentDate') {
      aVal = aVal ? new Date(aVal).getTime() : 0
      bVal = bVal ? new Date(bVal).getTime() : 0
    } else if (field === 'amount') {
      aVal = Number(aVal) || 0
      bVal = Number(bVal) || 0
    } else {
      aVal = String(aVal ?? '').toLowerCase()
      bVal = String(bVal ?? '').toLowerCase()
    }

    if (aVal < bVal) return -1 * dir
    if (aVal > bVal) return 1 * dir
    return 0
  })

  return sorted
}

export function paginateClaims(claims, page, pageSize) {
  const totalPages = Math.max(1, Math.ceil(claims.length / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * pageSize
  return {
    items: claims.slice(start, start + pageSize),
    totalPages,
    page: safePage,
    total: claims.length,
  }
}

export function computeClaimStats(claims) {
  return {
    totalClaims: claims.length,
    pendingClaims: claims.filter((c) => c.status === 'PENDING').length,
    approvedClaims: claims.filter((c) => c.status === 'APPROVED').length,
    rejectedClaims: claims.filter((c) => c.status === 'REJECTED').length,
    underReviewClaims: claims.filter((c) => c.status === 'UNDER_REVIEW').length,
  }
}

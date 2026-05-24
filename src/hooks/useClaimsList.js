import { useCallback, useEffect, useMemo, useState } from 'react'
import { claimApi } from '@/api/claim.api'
import { useAuth } from '@/hooks/useAuth'
import { normalizeClaimsPageResponse } from '@/services/claims'
import { getApiErrorMessage } from '@/services/apiError'
import { toast } from 'sonner'

const DEFAULT_PAGE_SIZE = 10

/**
 * Server-side list: GET /admin/claims or GET /claim/my with page, size, and filter query params.
 */
export function useClaimsList({
  filters,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  enabled = true,
} = {}) {
  const { isAdmin } = useAuth()
  const [claims, setClaims] = useState([])
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalItems: 0,
    last: true,
  })
  const [loading, setLoading] = useState(true)
  const filtersKey = useMemo(() => JSON.stringify(filters ?? {}), [filters])

  const fetchClaims = useCallback(async () => {
    if (!enabled) return
    setLoading(true)
    try {
      const options = {
        page: Math.max(0, page - 1),
        size: pageSize,
        filters: filters ?? {},
      }
      const res = isAdmin
        ? await claimApi.getAdminClaims(options)
        : await claimApi.getMyClaims(options)

      const { claims: list, totalPages, totalItems, last } =
        normalizeClaimsPageResponse(res)

      setClaims(list)
      setPagination({ totalPages, totalItems, last })
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to load claims'))
      setClaims([])
      setPagination({ totalPages: 1, totalItems: 0, last: true })
    } finally {
      setLoading(false)
    }
  }, [enabled, isAdmin, page, pageSize, filtersKey])

  useEffect(() => {
    fetchClaims()
  }, [fetchClaims])

  return {
    claims,
    totalPages: pagination.totalPages,
    totalCount: pagination.totalItems,
    loading,
    refetch: fetchClaims,
    isLast: pagination.last,
  }
}

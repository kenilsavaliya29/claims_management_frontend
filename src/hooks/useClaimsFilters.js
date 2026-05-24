import { useCallback, useState } from 'react'
import {
  DEFAULT_CLAIM_FILTERS,
  countActiveClaimFilters,
} from '@/services/claimQuery'

export function useClaimsFilters({ onFiltersChange } = {}) {
  const [applied, setApplied] = useState(DEFAULT_CLAIM_FILTERS)
  const [draft, setDraft] = useState(DEFAULT_CLAIM_FILTERS)
  const [sheetOpen, setSheetOpen] = useState(false)

  const applyFilters = useCallback(
    (next) => {
      setApplied(next)
      onFiltersChange?.()
    },
    [onFiltersChange]
  )

  const openSheet = useCallback(() => {
    setDraft(applied)
    setSheetOpen(true)
  }, [applied])

  const applyDraft = useCallback(() => {
    setApplied(draft)
    setSheetOpen(false)
    onFiltersChange?.()
  }, [draft, onFiltersChange])

  const clearAll = useCallback(() => {
    setDraft(DEFAULT_CLAIM_FILTERS)
    setApplied(DEFAULT_CLAIM_FILTERS)
    onFiltersChange?.()
  }, [onFiltersChange])

  const toggleQuickFilter = useCallback(
    (key, value) => {
      const next = {
        ...applied,
        [key]: applied[key] === value ? '' : value,
      }
      applyFilters(next)
      setDraft(next)
    },
    [applied, applyFilters]
  )

  const applySearch = useCallback(
    (search) => {
      const next = { ...applied, search }
      applyFilters(next)
      setDraft((d) => ({ ...d, search }))
    },
    [applied, applyFilters]
  )

  const activeCount = countActiveClaimFilters(applied)

  return {
    applied,
    draft,
    setDraft,
    sheetOpen,
    setSheetOpen,
    openSheet,
    applyDraft,
    clearAll,
    toggleQuickFilter,
    applySearch,
    activeCount,
  }
}

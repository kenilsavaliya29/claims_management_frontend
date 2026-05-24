import { useEffect, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ClaimsFiltersSheet } from './ClaimsFiltersSheet'
import { CLAIM_QUICK_FILTERS } from '@/utils/constants'
import { cn } from '@/utils/cn'

export function ClaimsFilterBar({
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
  searchPlaceholder = 'Search claims...',
}) {
  const [searchInput, setSearchInput] = useState(applied.search)

  useEffect(() => {
    setSearchInput(applied.search)
  }, [applied.search])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    applySearch(searchInput)
  }

  const isQuickActive = (key, value) => applied[key] === value

  return (
    <>
      <div className="mb-6 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-9"
              placeholder={searchPlaceholder}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          {CLAIM_QUICK_FILTERS.map(({ key, value, label }) => (
            <button
              key={`${key}-${value}`}
              type="button"
              onClick={() => toggleQuickFilter(key, value)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                isQuickActive(key, value)
                  ? 'border-brand-600 bg-brand-50 text-brand-800'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              )}
            >
              {label}
            </button>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2 rounded-full"
            onClick={openSheet}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1.5 text-xs font-semibold text-white">
                {activeCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      <ClaimsFiltersSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        draft={draft}
        onDraftChange={setDraft}
        onApply={applyDraft}
        onClear={clearAll}
      />
    </>
  )
}

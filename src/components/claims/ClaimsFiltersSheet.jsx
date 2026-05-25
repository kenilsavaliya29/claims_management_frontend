import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import {
  CLAIM_STATUSES,
  CLAIM_TYPES,
  CLAIM_SORT_FIELDS,
} from '@/utils/constants'

export function ClaimsFiltersSheet({
  open,
  onOpenChange,
  draft,
  onDraftChange,
  onApply,
  onClear,
}) {
  const set = (key, value) => onDraftChange({ ...draft, [key]: value })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        title="All filters"
        description="Refine claims by status, type, amount, dates, and sort order."
      >
        <div className="space-y-5">
          <FilterField label="Status" >
            <Select
              value={draft.status || 'ALL'}
              onValueChange={(v) => set('status', v === 'ALL' ? '' : v)}
              className="cursor-pointer"
              placeholder="All statuses"
              options={[
                { value: 'ALL', label: 'All statuses' },
                ...Object.values(CLAIM_STATUSES).map((s) => ({
                  value: s,
                  label: s.replace(/_/g, ' '),
                })),
              ]}
            />
          </FilterField>

          <FilterField label="Claim type">
            <Select
              value={draft.claimType || 'ALL'}
              onValueChange={(v) => set('claimType', v === 'ALL' ? '' : v)}
              className="cursor-pointer"
              placeholder="All types"
              options={[
                { value: 'ALL', label: 'All types' },
                ...CLAIM_TYPES.map((t) => ({ value: t, label: t })),
              ]}
            />
          </FilterField>

          <div className="grid grid-cols-2 gap-3">
            <FilterField label="Sort by">
              <Select
                value={draft.sortBy}
                className="cursor-pointer"
                onValueChange={(v) => set('sortBy', v)}
                options={CLAIM_SORT_FIELDS}
              />
            </FilterField>
            <FilterField label="Direction">
              <Select
                value={draft.sortDirection}
                className="cursor-pointer"
                onValueChange={(v) => set('sortDirection', v)}
                options={[
                  { value: 'desc', label: 'Descending' },
                  { value: 'asc', label: 'Ascending' },
                ]}
              />
            </FilterField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FilterField label="Min amount">
              <Input
                type="number"
                min="0"
                placeholder="1000"
                className="cursor-pointer"
                value={draft.minAmount}
                onChange={(e) => set('minAmount', e.target.value)}
              />
            </FilterField>
            <FilterField label="Max amount">
              <Input
                type="number"
                min="0"
                placeholder="50000"
                className="cursor-pointer"
                value={draft.maxAmount}
                onChange={(e) => set('maxAmount', e.target.value)}
              />
            </FilterField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FilterField label="From date">
              <Input
                type="date"
                value={draft.fromDate}
                className="cursor-pointer"
                onChange={(e) => set('fromDate', e.target.value)}
              />
            </FilterField>
            <FilterField label="To date">
              <Input
                type="date"
                value={draft.toDate}
                className="cursor-pointer"
                onChange={(e) => set('toDate', e.target.value)}
              />
            </FilterField>
          </div>
        </div>

        <div className="mt-8 flex gap-3 border-t border-slate-100 pt-4">
          <Button className="flex-1 cursor-pointer" onClick={onApply} >
            Apply filters
          </Button>
          <Button variant="outline" onClick={onClear} className="cursor-pointer">
            Clear all
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function FilterField({ label, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-slate-600">{label}</Label>
      {children}
    </div>
  )
}

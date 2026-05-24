import { useEffect, useState } from 'react'
import { getAdminRemarks } from '@/services/claims'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { FormField } from '@/components/forms/FormField'
import { ADMIN_UPDATE_STATUSES, CLAIM_STATUSES } from '@/utils/constants'

export function UpdateStatusModal({ open, onOpenChange, claim, onSubmit, loading }) {
  const [status, setStatus] = useState(CLAIM_STATUSES.UNDER_REVIEW)
  const [adminRemarks, setAdminRemarks] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setAdminRemarks('')
      setError('')
      setStatus(CLAIM_STATUSES.UNDER_REVIEW)
    }
  }, [open, claim?.claimId, claim?.id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!adminRemarks.trim()) {
      setError('Admin remarks are required')
      return
    }
    setError('')
    await onSubmit({ status, adminRemarks: adminRemarks.trim() })
  }

  const previousRemarks = claim ? getAdminRemarks(claim) : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title="Update Claim Status"
        description={claim ? `Claim #${claim.claimId || claim.id} — ${claim.title}` : ''}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="New Status" required>
            <Select
              value={status}
              onValueChange={setStatus}
              options={ADMIN_UPDATE_STATUSES.map((s) => ({
                value: s,
                label: s.replace(/_/g, ' '),
              }))}
            />
          </FormField>

          {previousRemarks && (
            <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Previous remarks
              </p>
              <p className="mt-1">{previousRemarks}</p>
            </div>
          )}

          <FormField label="Admin remarks" error={error} required>
            <Textarea
              value={adminRemarks}
              onChange={(e) => {
                setAdminRemarks(e.target.value)
                setError('')
              }}
              placeholder="Reason for approval, rejection, or review notes..."
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Status'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

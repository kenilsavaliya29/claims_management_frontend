import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { claimApi } from '@/api/claim.api'
import { ClaimForm } from '@/components/forms/ClaimForm'
import { ClaimDocumentsUpload, ClaimDocumentsSummary } from '@/components/claims/ClaimDocumentsUpload'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getApiErrorMessage } from '@/services/apiError'
import { parseCreateClaimResponse } from '@/services/claimResponse'
import { getDocumentTypesForClaimType } from '@/utils/documentTypes'
import { cn } from '@/utils/cn'

const STEPS = [
  { id: 'details', label: 'Claim details' },
  { id: 'documents', label: 'Documents' },
]

export function ClaimCreateWizard() {
  const navigate = useNavigate()
  const [step, setStep] = useState('details')
  const [creating, setCreating] = useState(false)
  const [claimId, setClaimId] = useState(null)
  const [claimType, setClaimType] = useState('')
  const [uploadedCount, setUploadedCount] = useState(0)

  const documentTypeCount = claimType
    ? getDocumentTypesForClaimType(claimType).length
    : 0

  const handleCreateClaim = async (payload) => {
    setCreating(true)
    try {
      const res = await claimApi.create(payload)
      const { claimId: id } = parseCreateClaimResponse(res)
      setClaimId(id)
      setClaimType(payload.claimType)
      setStep('documents')
      toast.success('Claim created. Upload your supporting documents.')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to create claim'))
    } finally {
      setCreating(false)
    }
  }

  const handleFinish = () => {
    if (uploadedCount === 0) {
      toast.message('You can upload documents later from claim details.')
    } else {
      toast.success('Claim and documents submitted successfully!')
    }
    navigate('/claims/my')
  }

  return (
    <div className="max-w-3xl space-y-6">
      <nav className="flex gap-2" aria-label="Claim registration steps">
        {STEPS.map((s, index) => {
          const isActive = step === s.id
          const isDone = s.id === 'details' && step === 'documents'
          return (
            <div key={s.id} className="flex items-center gap-2">
              <button
                type="button"
                disabled={s.id === 'documents' && !claimId}
                onClick={() => s.id === 'details' && setStep('details')}
                className={cn(
                  'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  isActive && 'bg-brand-700 text-white',
                  isDone && !isActive && 'bg-brand-100 text-brand-800',
                  !isActive && !isDone && 'bg-slate-100 text-slate-500',
                  s.id === 'documents' && !claimId && 'cursor-not-allowed opacity-50'
                )}
              >
                <span
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold',
                    isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-600'
                  )}
                >
                  {index + 1}
                </span>
                {s.label}
              </button>
              {index < STEPS.length - 1 && (
                <span className="hidden h-px w-8 bg-slate-200 sm:block" />
              )}
            </div>
          )
        })}
      </nav>

      {step === 'details' && (
        <Card>
          <CardHeader>
            <CardTitle>Claim information</CardTitle>
            <CardDescription>
              Enter incident details. You will upload documents in the next step.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClaimForm
              onSubmit={handleCreateClaim}
              loading={creating}
              submitLabel={creating ? 'Creating claim...' : 'Continue to documents'}
              onClaimTypeChange={setClaimType}
            />
          </CardContent>
        </Card>
      )}

      {step === 'documents' && claimId && (
        <Card>
          <CardHeader>
            <CardTitle>Upload documents</CardTitle>
            <CardDescription>
              Claim <span className="font-medium text-slate-700">#{claimId}</span> ·{' '}
              {claimType.replace(/_/g, ' ')} claim
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ClaimDocumentsSummary
              uploadedCount={uploadedCount}
              totalTypes={documentTypeCount}
            />
            <ClaimDocumentsUpload
              claimId={claimId}
              claimType={claimType}
              onUploadComplete={setUploadedCount}
            />
            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
              <Button type="button" variant="secondary" onClick={() => setStep('details')}>
                Back
              </Button>
              <Button type="button" onClick={handleFinish}>
                {uploadedCount > 0 ? 'Finish' : 'Skip for now'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

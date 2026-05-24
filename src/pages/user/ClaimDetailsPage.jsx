import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, DollarSign, FileText, MessageSquare } from 'lucide-react'
import { claimApi } from '@/api/claim.api'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatCurrency, formatDate, formatDateTime } from '@/utils/format'
import { getApiErrorMessage, unwrapApiData } from '@/services/apiError'
import { getAdminRemarks } from '@/services/claims'
import { AdminRemarksBlock } from '@/components/claims/AdminRemarksCell'
import { toast } from 'sonner'

export function ClaimDetailsPage() {
  const { claimId } = useParams()
  const [claim, setClaim] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        const res = await claimApi.getById(claimId)
        setClaim(unwrapApiData(res))
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Failed to load claim'))
      } finally {
        setLoading(false)
      }
    }
    fetchClaim()
  }, [claimId])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    )
  }

  if (!claim) {
    return (
      <div className="text-center">
        <p className="text-slate-500">Claim not found.</p>
        <Button variant="link" asChild className="mt-4">
          <Link to="/claims/my">Back to My Claims</Link>
        </Button>
      </div>
    )
  }

  const adminRemarks = getAdminRemarks(claim)
  const timeline = claim.statusHistory ?? claim.timeline ?? [
    {
      status: claim.status,
      adminRemarks,
      updatedAt: claim.updatedAt ?? claim.createdAt,
    },
  ]

  return (
    <div>
      <PageHeader
        title={`Claim #${claim.claimId ?? claim.id}`}
        description={claim.title}
        actions={
          <Button variant="secondary" asChild>
            <Link to="/claims/my">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Claim Details</CardTitle>
              <StatusBadge status={claim.status} />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailItem icon={FileText} label="Claim Type" value={claim.claimType} />
                <DetailItem icon={DollarSign} label="Amount" value={formatCurrency(claim.amount)} />
                <DetailItem icon={Calendar} label="Incident Date" value={formatDate(claim.incidentDate)} />
                <DetailItem icon={Calendar} label="Submitted" value={formatDate(claim.createdAt ?? claim.createdDate)} />
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-slate-500">Description</p>
                <p className="mt-2 text-slate-700 leading-relaxed">{claim.description}</p>
              </div>
              {adminRemarks && (
                <>
                  <Separator />
                  <div className="flex gap-3">
                    <MessageSquare className="h-5 w-5 shrink-0 text-brand-600" />
                    <AdminRemarksBlock claim={claim} className="flex-1 bg-transparent p-0" />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Status Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="relative space-y-6 border-l-2 border-brand-100 pl-6">
              {(Array.isArray(timeline) ? timeline : []).map((entry, idx) => (
                <li key={idx} className="relative">
                  <span className="absolute left-[-31px] flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 ring-4 ring-white" />
                  <div>
                    <StatusBadge status={entry.status} />
                    {getAdminRemarks(entry) && (
                      <p className="mt-2 text-sm text-slate-600">{getAdminRemarks(entry)}</p>
                    )}
                    <p className="mt-1 text-xs text-slate-400">
                      {formatDateTime(entry.updatedAt ?? entry.createdAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3">
      <div className="rounded-lg bg-brand-50 p-2 text-brand-700">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-0.5 font-medium text-slate-900">{value ?? '—'}</p>
      </div>
    </div>
  )
}

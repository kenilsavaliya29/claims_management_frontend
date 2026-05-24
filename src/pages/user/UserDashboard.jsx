import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Clock, CheckCircle, XCircle, Plus } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { claimApi } from '@/api/claim.api'
import { normalizeClaimsPageResponse, computeClaimStats } from '@/services/claims'
import { getApiErrorMessage } from '@/services/apiError'
import { toast } from 'sonner'

const defaultStats = {
  totalClaims: 0,
  pendingClaims: 0,
  approvedClaims: 0,
  rejectedClaims: 0,
}

export function UserDashboard() {
  const { name, email } = useAuth()
  const [stats, setStats] = useState(defaultStats)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await claimApi.getMyClaims({ page: 0, size: 100 })
        const { claims: list, totalItems } = normalizeClaimsPageResponse(res)
        setStats({
          ...computeClaimStats(list),
          totalClaims: totalItems,
        })
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Failed to load statistics'))
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div>
      <PageHeader
        title={`Welcome back${name ? `, ${name}` : ''}`}
        description="Manage your insurance claims from one secure dashboard."
        actions={
          <Button asChild>
            <Link to="/claims/create">
              <Plus className="h-4 w-4" />
              New Claim
            </Link>
          </Button>
        }
      />

      <Card className="mb-8 border-brand-100 bg-linear-to-br from-brand-50 to-white">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-brand-700">Policyholder Account</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{email}</p>
            <p className="mt-1 text-sm text-slate-500">
              Submit new claims or track existing ones in real time.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/claims/my">View My Claims</Link>
          </Button>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Claims" value={stats.totalClaims} icon={FileText} accent="brand" />
          <StatCard title="Pending" value={stats.pendingClaims} icon={Clock} accent="amber" />
          <StatCard title="Approved" value={stats.approvedClaims} icon={CheckCircle} accent="emerald" />
          <StatCard title="Rejected" value={stats.rejectedClaims} icon={XCircle} accent="red" />
        </div>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/claims/create">File a New Claim</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/claims/my">Browse My Claims</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

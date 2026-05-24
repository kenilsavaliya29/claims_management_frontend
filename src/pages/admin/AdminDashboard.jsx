import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
} from 'lucide-react'
import { claimApi } from '@/api/claim.api'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { DataTable } from '@/components/common/DataTable'
import { StatusBadge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency, formatDate } from '@/utils/format'
import {
  normalizeClaimsPageResponse,
  computeClaimStats,
  getClaimantEmail,
} from '@/services/claims'
import { getApiErrorMessage } from '@/services/apiError'
import { toast } from 'sonner'

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalClaims: 0,
    pendingClaims: 0,
    approvedClaims: 0,
    rejectedClaims: 0,
  })
  const [recentClaims, setRecentClaims] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await claimApi.getAdminClaims({ page: 0, size: 100 })
        const { claims: list, totalItems } = normalizeClaimsPageResponse(res)
        setStats({
          ...computeClaimStats(list),
          totalClaims: totalItems,
        })
        setRecentClaims(
          [...list]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
        )
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Failed to load admin dashboard'))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const columns = [
    {
      key: 'claimId',
      header: 'ID',
      render: (row) => `#${row.claimId ?? row.id}`,
    },
    { key: 'title', header: 'Title' },
    {
      key: 'createdBy',
      header: 'Claimant',
      render: (row) => getClaimantEmail(row),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (row) => formatCurrency(row.amount),
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (row) => formatDate(row.createdAt ?? row.createdDate),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        description="Overview of all insurance claims and workflow metrics."
        actions={
          <Button asChild>
            <Link to="/admin/claims">
              Manage Claims
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        }
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Claims" value={stats.totalClaims} icon={FileText} />
          <StatCard title="Pending" value={stats.pendingClaims} icon={Clock} accent="amber" />
          <StatCard title="Approved" value={stats.approvedClaims} icon={CheckCircle} accent="emerald" />
          <StatCard title="Rejected" value={stats.rejectedClaims} icon={XCircle} accent="red" />
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Claims</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/claims">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={recentClaims}
              loading={loading}
              emptyTitle="No claims yet"
              emptyDescription="Claims will appear here as users submit them."
            />
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-brand-700 to-brand-900 text-white">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-brand-100">Workflow Summary</p>
            <p className="mt-4 text-3xl font-bold">{stats.totalClaims}</p>
            <p className="text-brand-100">Total active claims in system</p>
            <div className="mt-6 space-y-3">
              <Bar label="Pending" value={stats.pendingClaims} total={stats.totalClaims} color="bg-amber-400" />
              <Bar label="Approved" value={stats.approvedClaims} total={stats.totalClaims} color="bg-emerald-400" />
              <Bar label="Rejected" value={stats.rejectedClaims} total={stats.totalClaims} color="bg-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Bar({ label, value, total, color }) {
  const pct = total ? Math.round((value / total) * 100) : 0
  return (
    <div>
      <div className="flex justify-between text-xs">
        <span className="text-brand-100">{label}</span>
        <span>{value} ({pct}%)</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/20">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

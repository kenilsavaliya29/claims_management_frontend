import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useClaimsList } from '@/hooks/useClaimsList'
import { useClaimsFilters } from '@/hooks/useClaimsFilters'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable } from '@/components/common/DataTable'
import { Pagination } from '@/components/common/Pagination'
import { ClaimsFilterBar } from '@/components/claims/ClaimsFilterBar'
import { StatusBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AdminRemarksCell } from '@/components/claims/AdminRemarksCell'
import { formatCurrency, formatDate } from '@/utils/format'

const PAGE_SIZE = 10

export function MyClaimsPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)

  const filterState = useClaimsFilters({ onFiltersChange: () => setPage(1) })

  const { claims, totalPages, totalCount, loading } = useClaimsList({
    page,
    pageSize: PAGE_SIZE,
    filters: filterState.applied,
  })

  const columns = [
    {
      key: 'claimId',
      header: 'Claim ID',
      render: (row) => (
        <span className="font-medium text-brand-700">#{row.claimId ?? row.id}</span>
      ),
    },
    { key: 'title', header: 'Title' },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'adminRemarks',
      header: 'Admin remarks',
      render: (row) => <AdminRemarksCell claim={row} />,
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (row) => formatCurrency(row.amount),
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (row) => formatDate(row.createdAt ?? row.createdDate),
    },
  ]

  return (
    <div>
      <PageHeader
        title="My Claims"
        description="View and track all your submitted insurance claims."
        actions={
          <Button asChild>
            <Link to="/claims/create">New Claim</Link>
          </Button>
        }
      />

      <ClaimsFilterBar
        {...filterState}
        searchPlaceholder="Search by title or claim ID..."
      />

      <DataTable
        columns={columns}
        data={claims}
        loading={loading}
        rowKey="claimId"
        onRowClick={(row) => navigate(`/claims/${row.claimId ?? row.id}`)}
        emptyTitle="No claims yet"
        emptyDescription="Submit your first claim or adjust your filters."
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={setPage}
      />
    </div>
  )
}

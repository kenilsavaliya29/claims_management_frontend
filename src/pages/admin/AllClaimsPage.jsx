import { useState } from 'react'
import { useClaimsList } from '@/hooks/useClaimsList'
import { useClaimsFilters } from '@/hooks/useClaimsFilters'
import { adminApi } from '@/api/admin.api'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable } from '@/components/common/DataTable'
import { Pagination } from '@/components/common/Pagination'
import { ClaimsFilterBar } from '@/components/claims/ClaimsFilterBar'
import { StatusBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UpdateStatusModal } from '@/components/claims/UpdateStatusModal'
import { formatCurrency, formatDate } from '@/utils/format'
import { AdminRemarksCell } from '@/components/claims/AdminRemarksCell'
import { getClaimantEmail } from '@/services/claims'
import { getApiErrorMessage } from '@/services/apiError'
import { toast } from 'sonner'

const PAGE_SIZE = 10

export function AllClaimsPage() {
  const [page, setPage] = useState(1)
  const [selectedClaim, setSelectedClaim] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [updating, setUpdating] = useState(false)

  const filterState = useClaimsFilters({ onFiltersChange: () => setPage(1) })

  const { claims, totalPages, totalCount, loading, refetch } = useClaimsList({
    page,
    pageSize: PAGE_SIZE,
    filters: filterState.applied,
  })

  const handleUpdateStatus = async (payload) => {
    if (!selectedClaim) return
    setUpdating(true)
    try {
      const id = selectedClaim.claimId ?? selectedClaim.id
      await adminApi.updateClaimStatus(id, payload)
      toast.success('Claim status updated')
      setModalOpen(false)
      setSelectedClaim(null)
      refetch()
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to update status'))
    } finally {
      setUpdating(false)
    }
  }

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
    { key: 'claimType', header: 'Type' },
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
      key: 'incidentDate',
      header: 'Incident',
      render: (row) => formatDate(row.incidentDate),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation()
            setSelectedClaim(row)
            setModalOpen(true)
          }}
        >
          Update Status
        </Button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="All Claims"
        description="All available claims in the system."
      />

      <ClaimsFilterBar
        {...filterState}
        searchPlaceholder="Search by title, ID, or email..."
      />

      <DataTable columns={columns} data={claims} loading={loading} rowKey="claimId" />

      <Pagination
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={setPage}
      />

      <UpdateStatusModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        claim={selectedClaim}
        onSubmit={handleUpdateStatus}
        loading={updating}
      />
    </div>
  )
}

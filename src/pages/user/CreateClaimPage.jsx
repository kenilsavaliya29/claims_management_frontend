import { ClaimCreateWizard } from '@/components/claims/ClaimCreateWizard'
import { PageHeader } from '@/components/common/PageHeader'

export function CreateClaimPage() {
  return (
    <div>
      <PageHeader
        title="File a New Claim"
        description="Submit your claim details and upload supporting documents."
      />
      <ClaimCreateWizard />
    </div>
  )
}

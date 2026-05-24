import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { claimApi } from '@/api/claim.api'
import { PageHeader } from '@/components/common/PageHeader'
import { ClaimForm } from '@/components/forms/ClaimForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getApiErrorMessage } from '@/services/apiError'

export function CreateClaimPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (payload) => {
    setLoading(true)
    try {
      await claimApi.create(payload)
      toast.success('Claim submitted successfully!')
      navigate('/claims/my')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to submit claim'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="File a New Claim"
        description="Provide accurate details about your incident to expedite processing."
      />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Claim Information</CardTitle>
          <CardDescription>All fields marked with * are required</CardDescription>
        </CardHeader>
        <CardContent>
          <ClaimForm onSubmit={handleSubmit} loading={loading} />
        </CardContent>
      </Card>
    </div>
  )
}

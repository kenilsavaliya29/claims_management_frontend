import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { FormField } from './FormField'
import { CLAIM_TYPES } from '@/utils/constants'

const initialState = {
  claimType: '',
  title: '',
  description: '',
  incidentDate: '',
  amount: '',
}

export function ClaimForm({
  onSubmit,
  loading,
  submitLabel = 'Submit Claim',
  onClaimTypeChange,
}) {
  const [form, setForm] = useState(initialState)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const next = {}
    if (!form.claimType) next.claimType = 'Claim type is required'
    if (!form.title?.trim()) next.title = 'Title is required'
    if (!form.description?.trim()) next.description = 'Description is required'
    if (!form.incidentDate) next.incidentDate = 'Incident date is required'
    if (!form.amount || Number(form.amount) <= 0) next.amount = 'Valid amount is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    await onSubmit({
      ...form,
      amount: Number(form.amount),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField label="Claim Type" error={errors.claimType} required>
        <Select
          value={form.claimType}
          onValueChange={(v) => {
            setForm((p) => ({ ...p, claimType: v }))
            setErrors((p) => ({ ...p, claimType: undefined }))
            onClaimTypeChange?.(v)
          }}
          placeholder="Select claim type"
          options={CLAIM_TYPES.map((t) => ({ value: t, label: t }))}
        />
      </FormField>

      <FormField label="Title" error={errors.title} required htmlFor="title">
        <Input id="title" name="title" value={form.title} onChange={handleChange} placeholder="Brief claim title" />
      </FormField>

      <FormField label="Description" error={errors.description} required htmlFor="description">
        <Textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the incident and damages..."
        />
      </FormField>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Incident Date" error={errors.incidentDate} required htmlFor="incidentDate">
          <Input
            id="incidentDate"
            name="incidentDate"
            type="date"
            value={form.incidentDate}
            onChange={handleChange}
          />
        </FormField>

        <FormField label="Claim Amount (₹)" error={errors.amount} required htmlFor="amount">
          <Input
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
          />
        </FormField>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Please wait...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}

import { unwrapApiData } from './apiError'

export function parseCreateClaimResponse(response) {
  const data = unwrapApiData(response) ?? response?.data ?? {}
  const claimId = data.claimId ?? data.id

  if (!claimId) {
    throw new Error('Claim was created but no claim ID was returned')
  }

  return {
    claimId: String(claimId),
    claim: data,
  }
}

import api from './axios'

export const adminApi = {
  updateClaimStatus: (claimId, payload) =>
    api.post(`/admin/claim/${claimId}/status`, payload),
}

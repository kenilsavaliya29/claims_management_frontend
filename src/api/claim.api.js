import api from './axios'
import { buildClaimsQueryParams } from '@/services/claimQuery'

export const claimApi = {
  create: (payload) => api.post('/claim/create', payload),
  /** Current user's claims (paginated + filters). */
  getMyClaims: (options = {}) =>
    api.get('/claim/my', { params: buildClaimsQueryParams(options) }),
  /** All claims — admin only (paginated + filters). */
  getAdminClaims: (options = {}) =>
    api.get('/admin/claims', { params: buildClaimsQueryParams(options) }),
  getById: (claimId) => api.get(`/claim/${claimId}`),
}

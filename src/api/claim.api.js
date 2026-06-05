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
  /** multipart: file + documentType */
  uploadDocument: (claimId, file, documentType) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('documentType', documentType)
    return api.post(`/api/claims/${claimId}/documents`, formData)
  },
  /** Metadata for all documents on a claim. */
  getClaimDocuments: (claimId) => api.get(`/api/claims/${claimId}/documents`),
  /** Raw file bytes for preview or download. */
  fetchDocumentBlob: (documentId) =>
    api.get(`/api/documents/${documentId}`, { responseType: 'blob' }),
}

import { ROLES } from '@/utils/constants'

/**
 * Supports backend shapes:
 * - { message, token, role? }
 * - { success, data: { token, role } }
 */
export function parseLoginResponse(data) {
  const payload = data?.data ?? data
  const token = payload?.token ?? data?.token
  const message = payload?.message ?? data?.message
  const role = normalizeRole(payload?.role ?? data?.role)

  if (!token) {
    throw new Error(message || 'Invalid email or password')
  }

  return { token, role, message }
}

function normalizeRole(role) {
  if (!role) return ROLES.USER
  const upper = String(role).toUpperCase().replace(/^ROLE_/, '')
  if (upper === ROLES.ADMIN) return ROLES.ADMIN
  return ROLES.USER
}

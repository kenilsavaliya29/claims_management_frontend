import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { AccessDenied } from '@/pages/errors/AccessDenied'

export function RoleRoute({ children, allowedRole }) {
  const { role, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (role !== allowedRole) {
    return <AccessDenied />
  }

  return children
}

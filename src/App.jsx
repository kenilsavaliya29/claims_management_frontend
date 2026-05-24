import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/context/AuthContext'
import { AppRoutes } from '@/routes/AppRoutes'
import { ErrorBoundary } from '@/components/ErrorBoundary'

function AppContent() {
  const navigate = useNavigate()

  const handleUnauthorized = useCallback(() => {
    navigate('/login', { replace: true })
  }, [navigate])

  return (
    <AuthProvider onUnauthorized={handleUnauthorized}>
      <AppRoutes />
      <Toaster position="top-right" richColors closeButton />
    </AuthProvider>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  )
}

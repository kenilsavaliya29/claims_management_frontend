import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ROLES } from '@/utils/constants'
import { AuthLayout } from '@/layouts/AuthLayout'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleRoute } from './RoleRoute'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { UserDashboard } from '@/pages/user/UserDashboard'
import { CreateClaimPage } from '@/pages/user/CreateClaimPage'
import { MyClaimsPage } from '@/pages/user/MyClaimsPage'
import { ClaimDetailsPage } from '@/pages/user/ClaimDetailsPage'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { AllClaimsPage } from '@/pages/admin/AllClaimsPage'
import { NotFoundPage } from '@/pages/errors/NotFoundPage'

function HomeRedirect() {
  const { isAuthenticated, isAdmin } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Navigate to={isAdmin ? '/admin/dashboard' : '/dashboard'} replace />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/dashboard"
          element={
            <RoleRoute allowedRole={ROLES.USER}>
              <UserDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/claims/create"
          element={
            <RoleRoute allowedRole={ROLES.USER}>
              <CreateClaimPage />
            </RoleRoute>
          }
        />
        <Route
          path="/claims/my"
          element={
            <RoleRoute allowedRole={ROLES.USER}>
              <MyClaimsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/claims/:claimId"
          element={
            <RoleRoute allowedRole={ROLES.USER}>
              <ClaimDetailsPage />
            </RoleRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <RoleRoute allowedRole={ROLES.ADMIN}>
              <AdminDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/claims"
          element={
            <RoleRoute allowedRole={ROLES.ADMIN}>
              <AllClaimsPage />
            </RoleRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

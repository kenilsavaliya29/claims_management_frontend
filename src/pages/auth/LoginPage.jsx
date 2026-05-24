import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormField } from '@/components/forms/FormField'
import { ROLES } from '@/utils/constants'

export function LoginPage() {
  const { login, loading, isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin/dashboard' : '/dashboard', { replace: true })
    }
  }, [isAuthenticated, isAdmin, navigate])

  const validate = () => {
    const next = {}
    if (!form.email) next.email = 'Email is required'
    if (!form.password) next.password = 'Password is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      const result = await login(form)
      toast.success('Welcome back!')
      const from = location.state?.from?.pathname
      if (from) {
        navigate(from, { replace: true })
      } else {
        const destination =
          result.role === ROLES.ADMIN ? '/admin/dashboard' : '/dashboard'
        navigate(destination, { replace: true })
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Email" error={errors.email} required htmlFor="email">
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="you@company.com"
            />
          </FormField>
          <FormField label="Password" error={errors.password} required htmlFor="password">
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              placeholder="••••••••"
            />
          </FormField>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-brand-700 hover:underline">
            Register
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}

import { Link } from 'react-router-dom'
import { ShieldOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

export function AccessDenied() {
  const { isAdmin } = useAuth()

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <div className="rounded-full bg-red-50 p-4 text-red-600">
        <ShieldOff className="h-10 w-10" />
      </div>
      <h2 className="mt-4 text-xl font-semibold text-slate-900">Access Denied</h2>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        You don&apos;t have permission to view this page. Contact your administrator if you believe this is an error.
      </p>
      <Button className="mt-6" asChild>
        <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'}>
          Go to Dashboard
        </Link>
      </Button>
    </div>
  )
}

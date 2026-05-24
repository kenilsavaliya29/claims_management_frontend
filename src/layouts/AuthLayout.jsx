import { Link, Outlet } from 'react-router-dom'
import { Shield } from 'lucide-react'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 flex-col justify-between bg-linear-to-br from-brand-800 via-brand-700 to-brand-900 p-12 text-white lg:flex">
        <Link to="/" className="flex items-center gap-3">
          <div className="rounded-xl bg-white/10 p-2 backdrop-blur">
            <Shield className="h-8 w-8" />
          </div>
          <span className="text-2xl font-bold tracking-tight">ClaimGuard</span>
        </Link>
        <div>
          <h2 className="text-3xl font-bold leading-tight">
            Insurance claim management,
            <br />
            simplified.
          </h2>
          <p className="mt-4 max-w-md text-brand-100">
            Submit, track, and manage insurance claims with a secure enterprise portal built for policyholders and administrators.
          </p>
        </div>
        <p className="text-sm text-brand-200">© 2026 ClaimGuard Insurance. All rights reserved.</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-8">
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <Shield className="h-7 w-7 text-brand-700" />
          <span className="text-xl font-bold text-brand-800">ClaimGuard</span>
        </div>
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

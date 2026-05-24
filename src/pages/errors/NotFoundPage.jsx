import { Link } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="rounded-full bg-brand-50 p-4 text-brand-600">
        <FileQuestion className="h-12 w-12" />
      </div>
      <h1 className="mt-6 text-4xl font-bold text-slate-900">404</h1>
      <p className="mt-2 text-lg text-slate-600">Page not found</p>
      <p className="mt-1 max-w-sm text-sm text-slate-500">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button className="mt-8" asChild>
        <Link to="/">Go Home</Link>
      </Button>
    </div>
  )
}

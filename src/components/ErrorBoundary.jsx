import { Component } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <div className="rounded-full bg-red-50 p-4 text-red-600">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-slate-900">Something went wrong</h2>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            An unexpected error occurred. Please refresh the page or try again later.
          </p>
          <Button className="mt-6" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}

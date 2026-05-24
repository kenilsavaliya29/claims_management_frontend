import { Label } from '@/components/ui/label'

export function FormField({ label, error, required, children, htmlFor }) {
  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={htmlFor}>
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </Label>
      )}
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/utils/cn'

export function StatCard({ title, value, icon: Icon, trend, className, accent = 'brand' }) {
  const accents = {
    brand: 'bg-brand-50 text-brand-700',
    amber: 'bg-amber-50 text-amber-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    red: 'bg-red-50 text-red-700',
    blue: 'bg-blue-50 text-blue-700',
  }

  return (
    <Card className={cn('transition-shadow hover:shadow-md', className)}>
      <CardContent className="flex items-start justify-between p-6">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value ?? 0}</p>
          {trend && <p className="mt-1 text-xs text-slate-500">{trend}</p>}
        </div>
        {Icon && (
          <div className={cn('rounded-xl p-3', accents[accent] || accents.brand)}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

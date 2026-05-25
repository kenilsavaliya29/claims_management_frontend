import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/utils/cn'

export function Tabs({ className, ...props }) {
  return <TabsPrimitive.Root className={cn('w-full', className)} {...props} />
}

export function TabsList({ className, ...props }) {
  return (
    <TabsPrimitive.List
      className={cn(
        'flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1',
        className
      )}
      {...props}
    />
  )
}

export function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors',
        'hover:text-slate-900 data-[state=active]:bg-white data-[state=active]:text-brand-800 data-[state=active]:shadow-sm',
        className
      )}
      {...props}
    />
  )
}

export function TabsContent({ className, ...props }) {
  return (
    <TabsPrimitive.Content
      className={cn('mt-4 focus-visible:outline-none', className)}
      {...props}
    />
  )
}

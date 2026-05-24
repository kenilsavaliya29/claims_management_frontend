import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'

export function Sheet({ open, onOpenChange, children }) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </DialogPrimitive.Root>
  )
}

export function SheetContent({ className, title, description, children }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          'fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm',
          'data-[state=open]:animate-overlay-fade-in data-[state=closed]:animate-overlay-fade-out'
        )}
      />
      <DialogPrimitive.Content
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-xl outline-none',
          'will-change-transform data-[state=open]:animate-sheet-in data-[state=closed]:animate-sheet-out',
          className
        )}
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
          <div>
            {title && (
              <DialogPrimitive.Title className="text-lg font-semibold text-slate-900">
                {title}
              </DialogPrimitive.Title>
            )}
            {description && (
              <DialogPrimitive.Description className="mt-1 text-sm text-slate-500">
                {description}
              </DialogPrimitive.Description>
            )}
          </div>
          <DialogPrimitive.Close className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

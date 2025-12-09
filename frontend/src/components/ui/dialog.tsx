import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

interface DialogContentProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

function Dialog({ open, onOpenChange, children }: DialogProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onOpenChange(false)
        }
      }}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Dialog Content - Bottom Sheet Style */}
      <div className="relative z-[70] w-full max-w-md">
        {children}
      </div>
    </div>
  )
}

function DialogContent({ children, className, style }: DialogContentProps) {
  return (
    <div
      className={cn(
        "bg-background rounded-t-3xl shadow-lg max-h-[90vh] overflow-hidden flex flex-col",
        className
      )}
      style={style}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  )
}

function DialogHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-between p-4 border-b border-border", className)}>
      {children}
    </div>
  )
}

function DialogTitle({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <h2 className={cn("text-lg font-semibold text-foreground text-left", className)} style={style}>
      {children}
    </h2>
  )
}

function DialogClose({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      className="rounded-sm opacity-70 hover:opacity-100 transition-opacity"
    >
      <X className="w-5 h-5" />
      <span className="sr-only">Close</span>
    </button>
  )
}

function DialogBody({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={cn("overflow-y-auto flex-1", className)} style={style}>
      {children}
    </div>
  )
}

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogBody }


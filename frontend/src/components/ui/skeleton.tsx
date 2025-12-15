import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  shimmer?: boolean;
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  shimmer = true,
  style,
  ...props
}: SkeletonProps) {
  const baseStyles: React.CSSProperties = {
    width: width || (variant === 'circular' ? '100%' : undefined),
    height: height || (variant === 'circular' ? '100%' : undefined),
    ...style,
  };

  return (
    <div
      className={cn(
        'bg-muted animate-pulse',
        variant === 'circular' && 'rounded-full',
        variant === 'rectangular' && 'rounded-lg',
        variant === 'text' && 'rounded',
        shimmer && 'relative overflow-hidden',
        className
      )}
      style={baseStyles}
      {...props}
    >
      {shimmer && (
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      )}
    </div>
  );
}

// Card skeleton component
export function CardSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('bg-card border border-border rounded-xl p-4 space-y-3', className)} {...props}>
      <div className="flex items-center justify-between">
        <Skeleton variant="rectangular" width={40} height={40} className="rounded-lg" />
        <Skeleton variant="text" width={60} height={20} />
      </div>
      <Skeleton variant="text" width="80%" height={16} />
      <Skeleton variant="text" width="60%" height={24} />
    </div>
  );
}

// List item skeleton
export function ListItemSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('bg-card border border-border rounded-xl p-4', className)} {...props}>
      <div className="flex items-start gap-3">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="70%" height={16} />
          <Skeleton variant="text" width="50%" height={14} />
        </div>
        <Skeleton variant="rectangular" width={60} height={24} className="rounded-full" />
      </div>
    </div>
  );
}


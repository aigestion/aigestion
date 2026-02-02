import { cn } from '../../utils/cn';

interface SkeletonProps {
  readonly className?: string;
  readonly variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  readonly width?: string | number;
  readonly height?: string | number;
  readonly animation?: 'pulse' | 'wave' | 'none';
  readonly lines?: number; // For text variant
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  lines = 1,
  ...props
}: SkeletonProps) {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const baseClasses = cn(
    'bg-gray-200 dark:bg-gray-700',
    variantClasses[variant],
    animationClasses[animation],
    className,
  );

  const style = {
    width: width || (variant === 'text' ? '100%' : '40px'),
    height: height || (variant === 'text' ? '1em' : '40px'),
    ...props,
  } as React.CSSProperties;

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={cn(baseClasses, i === lines - 1 ? 'w-3/4' : 'w-full')}
            style={style}
          />
        ))}
      </div>
    );
  }

  return <div className={baseClasses} style={style} {...props} />;
}

// Predefined skeleton components
export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={20} />
          <Skeleton width="40%" height={16} />
        </div>
      </div>
      <Skeleton lines={3} />
      <div className="flex justify-between">
        <Skeleton width={80} height={32} variant="rounded" />
        <Skeleton width={80} height={32} variant="rounded" />
      </div>
    </div>
  );
}

export function ListSkeleton({ items = 3 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }, (_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton width="70%" height={16} />
            <Skeleton width="50%" height={14} />
          </div>
          <Skeleton width={60} height={24} variant="rounded" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }, (_, i) => (
            <Skeleton key={`header-${i}`} height={20} />
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="space-y-3">
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {Array.from({ length: columns }, (_, colIndex) => (
              <Skeleton key={`cell-${rowIndex}-${colIndex}`} height={16} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex flex-col items-center space-y-4">
        <Skeleton variant="circular" width={96} height={96} />
        <Skeleton width="60%" height={24} />
        <Skeleton width="80%" height={16} />
        <div className="w-full space-y-3">
          <Skeleton height={40} variant="rounded" />
          <Skeleton height={40} variant="rounded" />
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }, (_, i) => (
          <CardSkeleton key={`stat-${i}`} />
        ))}
      </div>

      {/* Chart Area */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <Skeleton width="30%" height={24} className="mb-4" />
        <Skeleton height={300} variant="rounded" />
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <Skeleton width="40%" height={24} className="mb-4" />
        <ListSkeleton items={5} />
      </div>
    </div>
  );
}

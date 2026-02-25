import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  lines?: number;
  animated?: boolean;
}

/**
 * Componente Skeleton Loader consistente para todo el frontend
 * Proporciona loading states elegantes y accesibles
 */
export const SkeletonLoader: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  lines = 1,
  animated = true,
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';
  const animationClass = animated ? 'animate-pulse' : '';

  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
        return 'rounded-none';
      case 'rounded':
        return 'rounded-lg';
      case 'text':
      default:
        return 'rounded';
    }
  };

  const style = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? '1rem' : undefined),
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${getVariantClasses()} ${animationClass}`}
            style={{
              width: index === lines - 1 ? '70%' : '100%',
              height: height || '1rem',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${getVariantClasses()} ${animationClass} ${className}`}
      style={style}
    />
  );
};

/**
 * Skeleton para cards
 */
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <motion.div
    className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center space-x-4 mb-4">
      <SkeletonLoader variant="circular" width={48} height={48} />
      <div className="flex-1 space-y-2">
        <SkeletonLoader width="60%" height={20} />
        <SkeletonLoader width="40%" height={16} />
      </div>
    </div>
    <SkeletonLoader lines={3} />
  </motion.div>
);

/**
 * Skeleton para listas
 */
export const ListSkeleton: React.FC<{ 
  items?: number; 
  className?: string;
  showAvatar?: boolean;
}> = ({ 
  items = 5, 
  className = '',
  showAvatar = true 
}) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: items }).map((_, index) => (
      <motion.div
        key={index}
        className="flex items-center space-x-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        {showAvatar && <SkeletonLoader variant="circular" width={40} height={40} />}
        <div className="flex-1 space-y-2">
          <SkeletonLoader width="80%" height={16} />
          <SkeletonLoader width="60%" height={14} />
        </div>
        <SkeletonLoader width={80} height={32} variant="rounded" />
      </motion.div>
    ))}
  </div>
);

/**
 * Skeleton para tablas
 */
export const TableSkeleton: React.FC<{
  rows?: number;
  columns?: number;
  className?: string;
}> = ({ 
  rows = 5, 
  columns = 4, 
  className = '' 
}) => (
  <div className={`w-full ${className}`}>
    {/* Header */}
    <div className="flex space-x-4 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
      {Array.from({ length: columns }).map((_, index) => (
        <SkeletonLoader key={`header-${index}`} height={20} className="flex-1" />
      ))}
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={`row-${rowIndex}`} className="flex space-x-4 py-2">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <SkeletonLoader 
            key={`cell-${rowIndex}-${colIndex}`} 
            height={16} 
            className="flex-1" 
          />
        ))}
      </div>
    ))}
  </div>
);

/**
 * Skeleton para dashboard
 */
export const DashboardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`space-y-6 ${className}`}>
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <CardSkeleton key={`stat-${index}`} />
      ))}
    </div>
    
    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <CardSkeleton className="h-80" />
      <CardSkeleton className="h-80" />
    </div>
    
    {/* Recent Activity */}
    <CardSkeleton className="h-96" />
  </div>
);

/**
 * Skeleton para 3D components
 */
export const ThreeDSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <motion.div
    className={`bg-gray-900 rounded-lg flex items-center justify-center ${className}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className="text-center space-y-4">
      <div className="w-16 h-16 border-4 border-nexus-cyan border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-gray-400 text-sm">Loading 3D Scene...</p>
    </div>
  </motion.div>
);

/**
 * Skeleton wrapper con fade-in
 */
export const SkeletonWrapper: React.FC<{
  children: React.ReactNode;
  isLoading: boolean;
  skeleton: React.ReactNode;
  className?: string;
}> = ({ children, isLoading, skeleton, className = '' }) => (
  <div className={className}>
    {isLoading ? (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {skeleton}
      </motion.div>
    ) : (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    )}
  </div>
);

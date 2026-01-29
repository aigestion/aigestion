import React from 'react';
import { cn } from '../../utils/cn';

export interface NavGroupProps {
  children: React.ReactNode;
  className?: string;
  isScrolled?: boolean;
}

export const NavGroup: React.FC<NavGroupProps> = ({
  children,
  className,
  isScrolled,
}) => {
  return (
    <div
      className={cn(
        'hidden lg:flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all duration-500',
        isScrolled
          ? 'bg-black/40 backdrop-blur-md border-white/10'
          : 'bg-white/5 border-white/5',
        className
      )}
    >
      {children}
    </div>
  );
};

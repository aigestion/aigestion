import React, { forwardRef } from 'react';
import { cn } from '../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label className="text-sm font-medium text-gray-400 ml-1">{label}</label>}
        <input
          ref={ref}
          className={cn(
            'flex h-12 w-full rounded-xl border border-[#2d2d35] bg-[#0a0a0c]',
            'px-4 py-2 text-base text-white outline-none',
            'placeholder:text-gray-600',
            'transition-all duration-200 focus:border-[#8a2be2] focus:ring-1 focus:ring-[#8a2be2]/50',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/50',
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };

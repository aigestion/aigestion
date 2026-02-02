import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  readonly size?: 'sm' | 'md' | 'lg' | 'xl';
  readonly loading?: boolean;
  readonly icon?: React.ReactNode;
  readonly iconPosition?: 'left' | 'right';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      'inline-flex items-center justify-center',
      'font-medium rounded-lg',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ];

    const variantClasses = {
      primary: [
        'bg-blue-600 text-white hover:bg-blue-700',
        'focus:ring-blue-500',
        'dark:bg-blue-500 dark:hover:bg-blue-600',
      ],
      secondary: [
        'bg-gray-600 text-white hover:bg-gray-700',
        'focus:ring-gray-500',
        'dark:bg-gray-700 dark:hover:bg-gray-600',
      ],
      outline: [
        'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
        'focus:ring-blue-500',
        'dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
      ],
      ghost: [
        'text-gray-700 hover:bg-gray-100',
        'focus:ring-gray-500',
        'dark:text-gray-300 dark:hover:bg-gray-800',
      ],
      destructive: [
        'bg-red-600 text-white hover:bg-red-700',
        'focus:ring-red-500',
        'dark:bg-red-500 dark:hover:bg-red-600',
      ],
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl',
    };

    const classes = cn(
      ...baseClasses,
      ...variantClasses[variant],
      sizeClasses[size],
      className
    );

    const renderIcon = () => {
      if (loading) {
        return <Loader2 className="w-4 h-4 animate-spin" />;
      }
      return icon;
    };

    const renderContent = () => {
      if (icon && iconPosition === 'right') {
        return (
          <>
            {children}
            {renderIcon() && <span className="ml-2">{renderIcon()}</span>}
          </>
        );
      }

      return (
        <>
          {renderIcon() && <span className="mr-2">{renderIcon()}</span>}
          {children}
        </>
      );
    };

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {renderContent()}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };

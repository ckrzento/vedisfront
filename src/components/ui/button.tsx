'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'danger-outline';
  size?: 'sm' | 'md';
  loading?: boolean;
}

const Spinner = ({ className = '' }: { className?: string }) => (
  <svg
    className={`spinner w-4 h-4 ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', loading = false, disabled, children, ...props }, ref) => {
    const baseStyles = `
      relative inline-flex items-center justify-center font-medium
      rounded-lg transition-all duration-150 ease-out
      focus:outline-none focus:ring-2 focus:ring-[#1D6D1D] focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const variants = {
      primary: `
        bg-[#1D6D1D] text-white
        hover:translate-y-[-1px] hover:shadow-md
        active:translate-y-0
      `,
      secondary: `
        bg-white text-[#0F0F0F] border border-[#E8E8E8]
        hover:bg-[#F5F5F5]
      `,
      ghost: `
        bg-transparent text-[#6B6B6B]
        hover:bg-[#F5F5F5] hover:text-[#0F0F0F]
      `,
      danger: `
        bg-[#E53935] text-white
        hover:translate-y-[-1px] hover:shadow-md
        active:translate-y-0
      `,
      'danger-outline': `
        bg-transparent text-[#E53935] border border-[#E53935]
        hover:bg-red-50
      `,
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        <span className={`inline-flex items-center gap-2 ${loading ? 'opacity-0' : ''}`}>
          {children}
        </span>
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Spinner className={variant === 'primary' || variant === 'danger' ? 'text-white' : 'text-[#1D6D1D]'} />
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

'use client';

import { ReactNode } from 'react';

type BadgeVariant = 'default' | 'green' | 'yellow' | 'gray' | 'required' | 'system' | 'custom' | 'purple';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-[#F5F5F5] text-[#6B6B6B]',
  green: 'bg-[#E8F5E8] text-[#1D6D1D]',
  yellow: 'bg-amber-50 text-amber-700',
  gray: 'bg-[#F5F5F5] text-[#ABABAB]',
  required: 'bg-[#E8F5E8] text-[#1D6D1D]',
  system: 'bg-[#F5F5F5] text-[#6B6B6B]',
  custom: 'bg-blue-50 text-blue-700',
  purple: 'bg-purple-50 text-purple-700',
};

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5
        text-xs font-medium rounded-md
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

export function ExternalBadge() {
  return <Badge variant="purple">API</Badge>;
}

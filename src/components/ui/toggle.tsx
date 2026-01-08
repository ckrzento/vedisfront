'use client';

import { forwardRef, InputHTMLAttributes } from 'react';

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ className = '', label, id, checked, onChange, ...props }, ref) => {
    const toggleId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <label
        htmlFor={toggleId}
        className={`inline-flex items-center gap-3 cursor-pointer ${className}`}
      >
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={toggleId}
            checked={checked}
            onChange={onChange}
            className="sr-only peer"
            {...props}
          />
          <div
            className={`
              w-9 h-5 rounded-full
              transition-colors duration-150
              peer-focus:ring-2 peer-focus:ring-[#1D6D1D] peer-focus:ring-offset-2
              ${checked ? 'bg-[#1D6D1D]' : 'bg-[#E8E8E8]'}
            `}
          />
          <div
            className={`
              absolute top-0.5 left-0.5
              w-4 h-4 rounded-full bg-white
              transition-transform duration-150 ease-out
              shadow-sm
              ${checked ? 'translate-x-4' : 'translate-x-0'}
            `}
          />
        </div>
        {label && (
          <span className="text-sm text-[#0F0F0F]">{label}</span>
        )}
      </label>
    );
  }
);

Toggle.displayName = 'Toggle';

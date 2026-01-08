'use client';

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[#0F0F0F]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-3 py-2 text-sm
            bg-white border rounded-lg
            placeholder:text-[#6B6B6B]/60
            transition-colors duration-150
            focus:outline-none
            ${error
              ? 'border-[#E53935] focus:border-[#E53935]'
              : 'border-[#E8E8E8] focus:border-[#1D6D1D]'
            }
            ${className}
          `}
          {...props}
        />
        {error && (
          <span className="text-xs text-[#E53935]">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-[#0F0F0F]"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            w-full px-3 py-2 text-sm
            bg-white border rounded-lg
            placeholder:text-[#6B6B6B]/60
            transition-colors duration-150
            focus:outline-none resize-none
            ${error
              ? 'border-[#E53935] focus:border-[#E53935]'
              : 'border-[#E8E8E8] focus:border-[#1D6D1D]'
            }
            ${className}
          `}
          rows={3}
          {...props}
        />
        {error && (
          <span className="text-xs text-[#E53935]">{error}</span>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className = '', icon, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type="search"
          className={`
            w-full py-2.5 text-sm
            bg-white border border-[#E8E8E8] rounded-lg
            placeholder:text-[#6B6B6B]/60
            transition-colors duration-150
            focus:outline-none focus:border-[#1D6D1D]
            ${icon ? 'pl-10 pr-4' : 'px-4'}
            ${className}
          `}
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

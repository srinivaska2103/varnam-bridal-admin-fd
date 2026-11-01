'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * ModernDropdown - A sleek custom dropdown component matching the modern Varnam aesthetic:
 * - Rounded corners, warm border, custom badge/icon support
 * - Eliminates default browser native select & blue highlight
 * - Smooth transition, outside click dismissal, fully mobile responsive
 */
export function ModernDropdown({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option...',
  className,
  buttonClassName,
  menuClassName,
  disabled = false,
  error,
  helperText,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const selectedOption = useMemo(() => {
    return options.find((opt) => String(opt.value) === String(value));
  }, [options, value]);

  return (
    <div className={cn('w-full relative space-y-1', className)} ref={dropdownRef}>
      {label && (
        <label className="block text-xs font-semibold text-stone-700">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'w-full flex items-center justify-between px-3 py-2 bg-white border rounded-xl text-xs sm:text-sm transition-all duration-150 cursor-pointer shadow-sm text-left select-none',
          isOpen
            ? 'border-orange-500 ring-2 ring-orange-500/15'
            : error
            ? 'border-rose-400 ring-2 ring-rose-500/15'
            : 'border-stone-200 hover:border-stone-300',
          disabled && 'opacity-50 cursor-not-allowed bg-stone-50',
          buttonClassName
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          {selectedOption?.badgeColor && (
            <span
              className={cn(
                'w-2 h-2 rounded-full shrink-0',
                selectedOption.badgeColor
              )}
            />
          )}
          <span
            className={cn(
              'truncate font-medium',
              selectedOption ? 'text-stone-900' : 'text-stone-400'
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <ChevronDown
          className={cn(
            'w-4 h-4 text-stone-400 shrink-0 ml-2 transition-transform duration-200',
            isOpen && 'rotate-180 text-orange-600'
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            'absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl bg-white border border-stone-200 shadow-xl py-1 text-xs focus:outline-none animate-in fade-in-0 zoom-in-95 duration-100',
            menuClassName
          )}
        >
          {options.length === 0 ? (
            <div className="px-3 py-2 text-stone-400 text-center">No options available</div>
          ) : (
            options.map((opt) => {
              const isSelected = String(opt.value) === String(value);
              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 text-left cursor-pointer transition-colors',
                    isSelected
                      ? 'bg-orange-50/80 text-orange-900 font-semibold'
                      : 'text-stone-700 hover:bg-stone-50 hover:text-stone-900'
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {opt.badgeColor && (
                      <span className={cn('w-2 h-2 rounded-full shrink-0', opt.badgeColor)} />
                    )}
                    <span className="truncate">{opt.label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-orange-600 shrink-0 ml-2" />}
                </button>
              );
            })
          )}
        </div>
      )}

      {error && <p className="text-[11px] text-rose-500">{error}</p>}
      {helperText && !error && <p className="text-[11px] text-stone-400">{helperText}</p>}
    </div>
  );
}


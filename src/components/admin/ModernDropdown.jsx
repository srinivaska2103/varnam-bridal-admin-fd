'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export function ModernDropdown({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option...',
  className = '',
  buttonClassName = '',
  menuClassName = '',
  disabled = false,
  error,
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

  const handleSelect = (val) => {
    onChange?.(val);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-xs font-bold text-stone-700 mb-1.5">
          {label}
        </label>
      )}

      {/* Main Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between text-left px-3.5 py-2.5 bg-white border rounded-xl text-xs font-medium transition-all shadow-xs outline-hidden cursor-pointer ${
          disabled
            ? 'bg-stone-50 text-stone-400 border-stone-200 cursor-not-allowed'
            : isOpen
            ? 'border-orange-500 ring-2 ring-orange-500/15 shadow-sm'
            : error
            ? 'border-rose-400 text-stone-900 hover:border-rose-500'
            : 'border-stone-200 hover:border-stone-300 text-stone-800'
        } ${buttonClassName}`}
      >
        <span className="truncate flex items-center gap-2 mr-2">
          {selectedOption?.dot && (
            <span className={`w-2 h-2 rounded-full shrink-0 ${selectedOption.dot}`} />
          )}
          {selectedOption ? (
            <span className="font-semibold text-stone-900 truncate">{selectedOption.label}</span>
          ) : (
            <span className="text-stone-400">{placeholder}</span>
          )}
        </span>

        <ChevronDown
          className={`w-4 h-4 text-stone-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-orange-600' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu Popup with Fixed Width / Z-Index */}
      {isOpen && (
        <div
          className={`absolute z-50 mt-1.5 min-w-[200px] w-full bg-white border border-stone-200/90 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-1.5 max-h-64 overflow-y-auto custom-scrollbar ${menuClassName}`}
        >
          {options.length === 0 ? (
            <div className="py-3 px-3 text-center text-xs text-stone-400">
              No options available
            </div>
          ) : (
            options.map((opt) => {
              const isSelected = String(opt.value) === String(value);
              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors text-left cursor-pointer ${
                    isSelected
                      ? 'bg-orange-50 text-orange-950 font-bold'
                      : 'text-stone-700 hover:bg-stone-50 hover:text-stone-900 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate pr-2">
                    {opt.dot && (
                      <span className={`w-2 h-2 rounded-full shrink-0 ${opt.dot}`} />
                    )}
                    <span className="truncate">{opt.label}</span>
                  </div>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-orange-600 shrink-0 ml-1.5" />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}

      {error && <p className="text-[11px] text-rose-500 font-medium mt-1">{error}</p>}
    </div>
  );
}


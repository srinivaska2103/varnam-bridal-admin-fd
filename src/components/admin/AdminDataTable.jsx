'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import { ModernDropdown } from './ModernDropdown';

export function AdminDataTable({
  columns = [],
  data = [],
  pagination,
  onPageChange,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search records...',
  filterOptions = [],
  selectedFilter = '',
  onFilterChange,
  isLoading = false,
  emptyMessage = 'No records found',
  actions,
}) {
  return (
    <div className="bg-white rounded-2xl border border-orange-100/90 shadow-[0_2px_12px_rgba(249,115,22,0.03)] flex flex-col">
      {/* Table Toolbar */}
      {(onSearchChange || onFilterChange || actions) && (
        <div className="p-4 border-b border-orange-100/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-gradient-to-r from-orange-50/30 via-white to-white rounded-t-2xl">
          <div className="flex flex-1 items-center gap-3">
            {onSearchChange && (
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-orange-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-stone-800 placeholder:text-stone-400"
                />
              </div>
            )}

            {onFilterChange && filterOptions.length > 0 && (
              <div className="flex items-center gap-1.5 min-w-[200px]">
                <Filter className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <ModernDropdown
                  value={selectedFilter}
                  onChange={onFilterChange}
                  options={filterOptions}
                  className="w-full"
                  buttonClassName="py-2 px-3.5 rounded-xl border-stone-200 bg-white"
                  menuClassName="w-56 right-0 left-auto"
                />
              </div>
            )}
          </div>

          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      {/* Table Body */}
      <div className="overflow-x-auto custom-scrollbar flex-1 rounded-b-2xl">
        <table className="w-full text-left text-xs text-stone-700">
          <thead className="bg-orange-50/40 border-b border-orange-100/80 text-stone-600 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`py-3.5 px-4 sm:px-5 ${col.className || ''}`}
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-stone-400 text-xs">
                  <div className="inline-block w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-2" />
                  <p>Loading real platform records...</p>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-stone-400 text-xs">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr key={row.id || rowIdx} className="hover:bg-orange-50/30 transition-colors">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={`py-3 px-4 ${col.className || ''}`}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && pagination.totalPages > 1 && (
        <div className="p-3 border-t border-stone-200 bg-stone-50/50 flex items-center justify-between text-xs text-stone-500">
          <div>
            Showing <span className="font-semibold text-stone-700">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
            <span className="font-semibold text-stone-700">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{' '}
            of <span className="font-semibold text-stone-700">{pagination.total}</span> records
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1.5 rounded-lg border border-stone-300 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium text-stone-700">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-1.5 rounded-lg border border-stone-300 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

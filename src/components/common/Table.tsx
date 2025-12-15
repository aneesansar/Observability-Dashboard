import { useState, useRef, useEffect } from "react";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { classNames } from "../../utils/classNames";
import type { TableProps } from "../../types/components.types";
import { useTranslation } from "react-i18next";

export default function Table<T>({
  data,
  columns,
  title,
  description,
  actionButton,
  onRowAction,
  rowActionLabel = "Edit",
  onRowReview,
  onRowUpdate,
  onRowDelete,
  getRowKey,
  emptyMessage = "No data available",
  page,
  pageSize,
  total,
  onPageChange,
}: TableProps<T>) {
  const { t } = useTranslation();
  const [columnWidths, setColumnWidths] = useState<Record<number, number>>({});
  const [resizingColumn, setResizingColumn] = useState<number | null>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (resizingColumn !== null) {
        const diff = e.clientX - startXRef.current;
        const newWidth = Math.max(100, startWidthRef.current + diff);
        setColumnWidths((prev) => ({
          ...prev,
          [resizingColumn]: newWidth,
        }));
      }
    };

    const handleMouseUp = () => {
      setResizingColumn(null);
    };

    if (resizingColumn !== null) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizingColumn]);

  const handleResizeStart = (colIdx: number, e: React.MouseEvent) => {
    e.preventDefault();
    const th = (e.target as HTMLElement).closest("th");
    if (th) {
      startXRef.current = e.clientX;
      startWidthRef.current = columnWidths[colIdx] || th.offsetWidth;
      setResizingColumn(colIdx);
    }
  };
  return (
    <div className="w-full max-w-full overflow-hidden">
      {(title || description || actionButton) && (
        <div className="px-0 sm:px-1 lg:px-2 flex items-center justify-between">
          <div className="flex-auto">
            {title && (
              <h1 className="text-base font-semibold text-gray-900 dark:text-white">
                {title}
              </h1>
            )}
            {description && (
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                {description}
              </p>
            )}
          </div>
          {actionButton && (
            <div className="ml-4 flex-none">
              <button
                type="button"
                onClick={actionButton.onClick}
                className={
                  actionButton.className ||
                  "block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gradient-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                }
              >
                {actionButton.label}
              </button>
            </div>
          )}
        </div>
      )}
      <div className="mt-4 px-0 sm:px-1 lg:px-2">
        {data.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {emptyMessage || t('general.no_data')}
            </p>
          </div>
        ) : (
          <div className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-white/10">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <table className="w-full border-separate border-spacing-0">
                  <thead>
                    <tr>
                      {columns.map((column, colIdx) => (
                        <th
                          key={column.key}
                          scope="col"
                          className={classNames(
                            "sticky top-0 z-10 border-b border-r border-gray-300 bg-white/75 py-2 px-2 sm:py-3.5 sm:px-3 text-left text-xs sm:text-sm font-semibold text-rich-black backdrop-blur-sm backdrop-filter dark:border-white/15 dark:bg-platinum dark:text-rich-black whitespace-nowrap",
                            colIdx === 0 && "pl-2 sm:pl-4 md:pl-6 lg:pl-8",
                            colIdx === columns.length - 1 && !onRowAction && "border-r-0",
                            column.hidden === "sm" && "hidden sm:table-cell",
                            column.hidden === "lg" && "hidden lg:table-cell",
                            column.headerClassName || ""
                          )}
                          style={{ 
                            width: columnWidths[colIdx] ? `${columnWidths[colIdx]}px` : "auto",
                            minWidth: "80px", 
                            position: "relative" 
                          }}
                        >
                          <div className="flex items-center justify-start">
                            {column.header}
                          </div>
                          {colIdx < columns.length - 1 && (
                            <div
                              onMouseDown={(e) => handleResizeStart(colIdx, e)}
                              className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary hover:w-1.5 transition-all z-20 rounded-full"
                              style={{ 
                                background: resizingColumn === colIdx ? "#2152E4" : "#333d4d"
                              }}
                            />
                          )}
                        </th>
                      ))}
                      {(onRowAction || onRowReview || onRowUpdate || onRowDelete) && (
                        <th
                          scope="col"
                          className="sticky top-0 z-10 border-b border-gray-300 bg-white/75 py-3.5 pr-4 pl-3 backdrop-blur-sm backdrop-filter sm:pr-6 lg:pr-8 dark:border-white/15 dark:bg-platinum text-rich-black text-right"
                        >
                          {(onRowReview || onRowUpdate || onRowDelete) ? t('general.actions') : <span className="sr-only">{rowActionLabel}</span>}
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-anti-flash-white">
                    {data.map((item, itemIdx) => (
                      <tr key={getRowKey(item)} className="group hover:bg-gray-200">
                        {columns.map((column, colIdx) => (
                          <td
                            key={column.key}
                            className={classNames(
                              "border-b border-rich-black group-hover:bg-gray-200",
                              itemIdx === 0 && "border-t border-rich-black",
                              "px-2 py-3 sm:px-3 sm:py-4 text-xs sm:text-sm text-left align-top bg-anti-flash-white text-charcoal",
                              colIdx === 0 && "pl-2 sm:pl-4 md:pl-6 lg:pl-8",
                              column.hidden === "sm" && "hidden sm:table-cell",
                              column.hidden === "lg" && "hidden lg:table-cell",
                              column.className || ""
                            )}
                          >
                            <div className="flex items-start justify-start">
                              {column.render
                                ? column.render(item)
                                : String((item as any)[column.key] ?? "")}
                            </div>
                          </td>
                        ))}
                        {(onRowAction || onRowReview || onRowUpdate || onRowDelete) && (
                          <td
                            className={classNames(
                              "border-b border-rich-black group-hover:bg-gray-200",
                              itemIdx === 0 && "border-t border-rich-black",
                              "py-3 pr-2 pl-2 sm:py-4 sm:pr-4 sm:pl-3 md:pr-8 lg:pr-8 text-right text-sm font-medium whitespace-nowrap bg-anti-flash-white"
                            )}
                          >
                            <div className="flex items-center justify-end gap-1 sm:gap-2">
                              {onRowReview && (
                                <button
                                  onClick={() => onRowReview(item)}
                                  className="p-1 sm:p-1.5 text-primary hover:text-secondary hover:bg-primary/10 rounded-md transition-colors touch-manipulation"
                                  title={t('general.review')}
                                >
                                  <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                  <span className="sr-only">{t('general.review')} {getRowKey(item)}</span>
                                </button>
                              )}
                              {onRowUpdate && (
                                <button
                                  onClick={() => onRowUpdate(item)}
                                  className="p-1 sm:p-1.5 text-primary hover:text-secondary hover:bg-primary/10 rounded-md transition-colors touch-manipulation"
                                  title={t('general.update')}
                                >
                                  <PencilIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                  <span className="sr-only">{t('general.update')} {getRowKey(item)}</span>
                                </button>
                              )}
                              {onRowDelete && (
                                <button
                                  onClick={() => onRowDelete(item)}
                                  className="p-1 sm:p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors touch-manipulation"
                                  title={t('general.delete')}
                                >
                                  <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                  <span className="sr-only">{t('general.delete')} {getRowKey(item)}</span>
                                </button>
                              )}
                              {onRowAction && !onRowReview && !onRowUpdate && !onRowDelete && (
                                <button
                                  onClick={() => onRowAction(item)}
                                  className="rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-white hover:bg-gradient-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
                                >
                                  {rowActionLabel}
                                  <span className="sr-only">
                                    , {getRowKey(item)}
                                  </span>
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          </div>
        )}
      </div>

      {/* Built-in Pagination (optional) */}
      {onPageChange && page && pageSize && (typeof total === 'number') && (
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 dark:border-white/10 dark:bg-transparent">
          {/* Mobile Prev/Next */}
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(Math.max(1, page - 1))}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-charcoal hover:bg-gradient-brand hover:text-white disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10"
            >
              {t('general.previous', 'Previous')}
            </button>
            <button
              type="button"
              disabled={page >= Math.max(1, Math.ceil((total || 0) / pageSize))}
              onClick={() => onPageChange(page + 1)}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-charcoal hover:bg-gradient-brand hover:text-white disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10"
            >
              {t('general.next', 'Next')}
            </button>
          </div>

          {/* Desktop Pagination */}
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-charcoal">
                {t('general.pagination_showing', 'Showing {{from}} to {{to}} of {{total}} results', {
                  from: (total === 0 ? 0 : (page - 1) * pageSize + 1),
                  to: Math.min(page * pageSize, total || data.length),
                  total: total || data.length,
                })}
              </p>
            </div>
            <div>
              <nav aria-label={t('general.pagination')} className="isolate inline-flex -space-x-px rounded-md shadow-xs dark:shadow-none">
                <button
                  type="button"
                  onClick={() => onPageChange(Math.max(1, page - 1))}
                  disabled={page <= 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-charcoal inset-ring inset-ring-gray-300 hover:bg-gradient-brand hover:text-white focus:z-20 focus:outline-offset-0 disabled:opacity-50 dark:inset-ring-gray-700 dark:hover:bg-white/5"
                >
                  <span className="sr-only">{t('general.previous', 'Previous')}</span>
                  <ChevronLeftIcon aria-hidden className="size-5" />
                </button>
                {Array.from({ length: Math.min(10, Math.max(1, Math.ceil((total || data.length) / pageSize))) }).map((_, i) => {
                  const totalPages = Math.max(1, Math.ceil((total || data.length) / pageSize));
                  const pageNum = i + 1;
                  if (totalPages <= 10) {
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => onPageChange(pageNum)}
                        aria-current={page === pageNum ? 'page' : undefined}
                        className={
                          page === pageNum
                            ? 'relative z-10 inline-flex items-center bg-primary px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:bg-primary dark:focus-visible:outline-primary'
                            : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-charcoal inset-ring inset-ring-gray-300 hover:bg-gradient-brand hover:text-white focus:z-20 focus:outline-offset-0 dark:text-charcoal dark:inset-ring-gray-700 dark:hover:bg-white/5'
                        }
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}
                <button
                  type="button"
                  onClick={() => onPageChange(page + 1)}
                  disabled={page >= Math.max(1, Math.ceil((total || data.length) / pageSize))}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-charcoal inset-ring inset-ring-gray-300 hover:bg-gradient-brand hover:text-white focus:z-20 focus:outline-offset-0 disabled:opacity-50 dark:inset-ring-gray-700 dark:hover:bg-white/5"
                >
                  <span className="sr-only">{t('general.next', 'Next')}</span>
                  <ChevronRightIcon aria-hidden className="size-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

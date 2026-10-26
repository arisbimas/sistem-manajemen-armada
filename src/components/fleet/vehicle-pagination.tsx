import { ChevronLeft, ChevronRight } from 'lucide-react'

const PAGE_SIZE_OPTIONS = [12, 24, 48]

type VehiclePaginationProps = {
  page: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function VehiclePagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: VehiclePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const firstItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const lastItem = Math.min(page * pageSize, totalItems)

  return (
    <nav
      className="mt-6 flex flex-col gap-3 border-t border-rule pt-4 text-xs sm:flex-row sm:items-center sm:justify-between"
      aria-label="Pagination"
    >
      <p className="text-muted">
        {totalItems === 0
          ? 'Showing 0 of 0 data'
          : `Showing ${firstItem}–${lastItem} of ${totalItems} data`}
      </p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <label className="flex items-center gap-2 text-muted">
          Data per page
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="h-8 rounded-control border border-rule-strong bg-surface px-2 text-xs text-ink"
          >
            {PAGE_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <span className="text-muted">
          Page {page} of {totalPages}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
            className="grid size-8 place-items-center rounded-control border border-rule-strong bg-surface transition-colors hover:bg-paper disabled:cursor-not-allowed disabled:opacity-45"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
            className="grid size-8 place-items-center rounded-control border border-rule-strong bg-surface transition-colors hover:bg-paper disabled:cursor-not-allowed disabled:opacity-45"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </nav>
  )
}

import * as Popover from '@radix-ui/react-popover'
import { ChevronDown, LoaderCircle } from 'lucide-react'
import { useMemo, type ReactNode, type UIEvent } from 'react'

type MultiSelectOption = {
  id: string
}

type MultiSelectProps<T extends MultiSelectOption> = {
  label: string
  allLabel: string
  options: T[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
  renderOption: (option: T) => ReactNode
  renderTriggerValue?: (selected: T[]) => ReactNode
  disabled?: boolean
  emptyText?: string
  hasMore?: boolean
  isLoading?: boolean
  isFetchingMore?: boolean
  error?: string | null
  onRetry?: () => void
  onLoadMore?: () => void
  onOpenChange?: (open: boolean) => void
}

export function MultiSelect<T extends MultiSelectOption>({
  label,
  allLabel,
  options,
  selectedIds,
  onChange,
  renderOption,
  renderTriggerValue,
  disabled = false,
  emptyText,
  hasMore = false,
  isLoading = false,
  isFetchingMore = false,
  error,
  onRetry,
  onLoadMore,
  onOpenChange,
}: MultiSelectProps<T>) {
  const uniqueOptions = useMemo(() => {
    const map = new Map<string, T>()

    for (const option of options) {
      map.set(option.id, option)
    }

    return [...map.values()]
  }, [options])

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds])
  const selectedOptions = useMemo(
    () => uniqueOptions.filter((option) => selectedSet.has(option.id)),
    [selectedSet, uniqueOptions],
  )

  const toggle = (id: string) => {
    const next = new Set(selectedIds)

    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }

    onChange([...next])
  }

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget

    if (!hasMore || isFetchingMore || !onLoadMore) {
      return
    }

    if (element.scrollHeight - element.scrollTop - element.clientHeight < 48) {
      onLoadMore()
    }
  }

  const summary =
    selectedIds.length === 0
      ? allLabel
      : renderTriggerValue
        ? renderTriggerValue(selectedOptions)
        : `${selectedIds.length} selected`

  return (
    <Popover.Root onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={`${label} filter`}
          className="inline-flex h-9 max-w-full items-center gap-2 rounded-control border border-rule-strong bg-surface px-3 text-xs transition-colors hover:bg-paper disabled:cursor-not-allowed disabled:opacity-45"
        >
          <span className="text-muted">{label}</span>
          <span className="min-w-0 truncate text-ink">{summary}</span>
          <ChevronDown className="size-3.5 shrink-0 text-muted" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          collisionPadding={8}
          aria-label={`${label} filter`}
          className="z-50 w-80 max-w-[calc(100vw-2rem)] rounded-overlay border border-rule bg-surface shadow-overlay"
        >
          <div className="flex items-center justify-between gap-3 border-b border-rule px-3 py-2">
            <span className="text-2xs font-medium text-muted">{label}</span>
            <span className="text-2xs text-muted">
              {selectedIds.length} selected
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto p-1" onScroll={handleScroll}>
            {error ? (
              <div className="px-3 py-6 text-center">
                <p className="text-xs text-muted">{error}</p>
                {onRetry && (
                  <button
                    type="button"
                    onClick={onRetry}
                    className="mt-2 text-xs text-primary hover:underline"
                  >
                    Try again
                  </button>
                )}
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-xs text-muted">
                <LoaderCircle className="size-4 animate-spin" />
                Loading…
              </div>
            ) : uniqueOptions.length === 0 ? (
              <p className="px-3 py-8 text-center text-xs text-muted">
                {emptyText ?? 'No results.'}
              </p>
            ) : (
              uniqueOptions.map((option) => {
                const checked = selectedSet.has(option.id)

                return (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-start gap-2 rounded-control px-2 py-1.5 text-xs transition-colors hover:bg-paper ${checked ? 'bg-primary-soft/40' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(option.id)}
                      className="mt-0.5 size-3.5 shrink-0 accent-primary"
                    />
                    <span className="min-w-0 flex-1">{renderOption(option)}</span>
                  </label>
                )
              })
            )}
          </div>

          <div className="flex items-center justify-between border-t border-rule px-3 py-2 text-2xs text-muted">
            {isLoading ? (
              <span>Loading…</span>
            ) : error ? (
              <span>Failed to load</span>
            ) : (
              <>
                <span>{uniqueOptions.length} data loaded</span>
                {isFetchingMore ? (
                  <LoaderCircle className="size-3.5 animate-spin" />
                ) : hasMore ? (
                  <span>Scroll for more</span>
                ) : (
                  <span>All data loaded</span>
                )}
              </>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

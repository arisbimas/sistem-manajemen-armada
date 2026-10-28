import * as Dialog from '@radix-ui/react-dialog'

export function VehicleDetailError({
  message,
  isRetrying,
  onRetry,
}: {
  message: string
  isRetrying: boolean
  onRetry: () => void
}) {
  return (
    <div className="px-2.5 pb-6 sm:px-6.5">
      <div
        role="alert"
        className="relative z-2 -mt-8.5 rounded-overlay border border-rule bg-surface p-6 text-center shadow-[0_16px_36px_-22px_rgba(18,59,93,0.45)] sm:-mt-12"
      >
        <p className="text-sm font-semibold">Could not load vehicle details</p>
        <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-muted">{message}</p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={isRetrying}
            onClick={onRetry}
            className="inline-flex h-8 items-center rounded-control bg-primary px-3 text-xs font-medium text-white transition-colors hover:bg-primary-dark disabled:cursor-wait disabled:opacity-70"
          >
            {isRetrying ? 'Retrying…' : 'Try again'}
          </button>
          <Dialog.Close asChild>
            <button
              type="button"
              className="inline-flex h-8 items-center rounded-control border border-rule-strong bg-surface px-3 text-xs font-medium text-ink transition-colors hover:bg-paper"
            >
              Close
            </button>
          </Dialog.Close>
        </div>
      </div>
    </div>
  )
}

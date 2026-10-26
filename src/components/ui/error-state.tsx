import { RotateCw } from 'lucide-react'

type ErrorStateProps = {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-card border border-rule bg-surface p-8 text-center">
      <p className="text-sm font-semibold">Could not load vehicles</p>
      <p className="mx-auto mt-1 max-w-md text-xs text-muted">{message}</p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-control bg-primary px-3 text-xs font-medium text-white transition-colors hover:bg-primary-dark"
      >
        <RotateCw className="size-3.5" />
        Try again
      </button>
    </div>
  )
}

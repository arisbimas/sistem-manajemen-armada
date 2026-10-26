export function VehicleGridSkeleton({ count }: { count: number }) {
  return (
    <ul
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <div className="rounded-card border border-rule bg-surface p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="h-7 w-16 animate-pulse rounded bg-rule" />
              <div className="h-5 w-24 animate-pulse rounded-full bg-rule/60" />
            </div>

            <div className="mt-4 space-y-2 border-t border-rule pt-3">
              <div className="h-4 w-full animate-pulse rounded bg-rule/60" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-rule/60" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

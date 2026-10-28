export function VehicleDetailSkeleton() {
  return (
    <>
      <p className="sr-only" role="status">
        Loading vehicle details…
      </p>

      <div aria-hidden="true" className="px-2.5 pb-1 sm:px-6.5">
        <div className="relative z-2 -mt-8.5 rounded-overlay border border-rule bg-surface p-3.5 shadow-[0_16px_36px_-22px_rgba(18,59,93,0.45)] sm:-mt-12 sm:p-4">
          <div className="h-3 w-16 animate-pulse rounded bg-rule" />
          <div className="mt-2 flex items-center gap-2.5">
            <div className="h-9 w-24 animate-pulse rounded bg-rule" />
            <div className="h-5 w-20 animate-pulse rounded-full bg-rule/70" />
          </div>
          <div className="mt-2 h-4 w-14 animate-pulse rounded bg-rule" />
        </div>

        <div className="mt-3.5 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border border-rule bg-rule">
          {[0, 1].map((item) => (
            <div key={item} className="bg-surface px-3.5 py-2.5">
              <div className="h-2.5 w-12 animate-pulse rounded bg-rule" />
              <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-rule/70" />
            </div>
          ))}
        </div>

        <div className="mt-4.5 grid gap-4 sm:grid-cols-2 sm:gap-x-8.5">
          {[0, 1].map((block) => (
            <div key={block}>
              <div className="h-3 w-16 animate-pulse rounded bg-rule" />
              <div className="mt-3 space-y-2.5">
                {[0, 1, 2, 3].map((row) => (
                  <div key={row} className="h-3.5 w-full animate-pulse rounded bg-rule/60" />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 mb-5.5 border-t border-rule pt-3.5">
          <div className="h-3 w-12 animate-pulse rounded bg-rule" />
          <div className="mt-3 flex gap-8">
            <div className="h-3.5 w-20 animate-pulse rounded bg-rule/60" />
            <div className="h-3.5 w-20 animate-pulse rounded bg-rule/60" />
            <div className="h-3.5 w-24 animate-pulse rounded bg-rule/60" />
          </div>
        </div>
      </div>
    </>
  )
}

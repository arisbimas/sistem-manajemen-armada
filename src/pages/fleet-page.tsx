import { useMemo, useState } from 'react'

import { VehicleGrid } from '@/components/fleet/vehicle-grid'
import { VehicleGridSkeleton } from '@/components/fleet/vehicle-grid-skeleton'
import { VehiclePagination } from '@/components/fleet/vehicle-pagination'
import { ErrorState } from '@/components/ui/error-state'
import { useVehicles } from '@/hooks/use-vehicles'
import type { Vehicle } from '@/types/vehicle'

const EMPTY_VEHICLES: Vehicle[] = []

export function FleetPage() {
  const [pageSize, setPageSize] = useState(12)
  const [page, setPage] = useState(1)

  const vehiclesQuery = useVehicles()
  const vehicles = vehiclesQuery.data ?? EMPTY_VEHICLES

  const totalItems = vehicles.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const currentPage = Math.min(page, totalPages)

  const pageItems = useMemo(
    () => vehicles.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [vehicles, currentPage, pageSize],
  )

  const handlePageSizeChange = (nextPageSize: number) => {
    setPageSize(nextPageSize)
    setPage(1)
  }

  const handlePageChange = (nextPage: number) => {
    setPage(Math.min(Math.max(1, nextPage), totalPages))
  }

  const retry = () => {
    void vehiclesQuery.refetch()
  }

  return (
    <div className="min-h-dvh bg-paper">
      <div className="border-t-[3px] border-primary bg-surface">
        <header className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold tracking-[-0.02em]">Fleet</span>
            <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-semibold tracking-wide text-primary">
              MBTA
            </span>
          </div>
        </header>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold tracking-[-0.02em]">Vehicles</h1>

        <div className="mt-6">
          {vehiclesQuery.isError ? (
            <ErrorState
              message={
                vehiclesQuery.error instanceof Error
                  ? vehiclesQuery.error.message
                  : 'Could not load vehicles.'
              }
              onRetry={retry}
            />
          ) : vehiclesQuery.isPending ? (
            <>
              <p className="sr-only" role="status">
                Loading vehicles…
              </p>
              <VehicleGridSkeleton count={pageSize} />
            </>
          ) : vehicles.length === 0 ? (
            <div className="rounded-card border border-rule bg-surface p-10 text-center text-sm text-muted">
              No vehicles found.
            </div>
          ) : (
            <VehicleGrid vehicles={pageItems} />
          )}
        </div>

        {!vehiclesQuery.isPending && !vehiclesQuery.isError && (
          <VehiclePagination
            page={currentPage}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </main>
    </div>
  )
}

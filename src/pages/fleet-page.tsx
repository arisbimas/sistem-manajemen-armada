import { useMemo, useState } from 'react'

import { VehicleDetailDialog } from '@/components/fleet/vehicle-detail-dialog'
import { VehicleFilters } from '@/components/fleet/vehicle-filters'
import { VehicleGrid } from '@/components/fleet/vehicle-grid'
import { VehicleGridSkeleton } from '@/components/fleet/vehicle-grid-skeleton'
import { VehiclePagination } from '@/components/fleet/vehicle-pagination'
import { ErrorState } from '@/components/ui/error-state'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { useVehicleTotal, useVehicles } from '@/hooks/use-vehicles'
import type { VehicleFilters as VehicleFilterState } from '@/types/filters'
import type { Vehicle } from '@/types/vehicle'

const EMPTY_VEHICLES: Vehicle[] = []

export function FleetPage() {
  const [pageSize, setPageSize] = useState(12)
  const [page, setPage] = useState(1)
  const [selectedRouteIds, setSelectedRouteIds] = useState<string[]>([])
  const [selectedTripIds, setSelectedTripIds] = useState<string[]>([])
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null)

  const debouncedRouteIds = useDebouncedValue(selectedRouteIds)
  const debouncedTripIds = useDebouncedValue(selectedTripIds)

  const filters = useMemo<VehicleFilterState>(
    () => ({
      routeIds: [...debouncedRouteIds].sort(),
      tripIds: [...debouncedTripIds].sort(),
    }),
    [debouncedRouteIds, debouncedTripIds],
  )

  const totalQuery = useVehicleTotal(filters)
  const totalItems = totalQuery.data
  const totalPages = totalItems === undefined ? 1 : Math.max(1, Math.ceil(totalItems / pageSize))
  const currentPage = totalItems === undefined ? page : Math.min(page, totalPages)

  const vehiclesQuery = useVehicles(currentPage, pageSize, filters)
  const vehicles = vehiclesQuery.data ?? EMPTY_VEHICLES

  const handlePageSizeChange = (nextPageSize: number) => {
    setPageSize(nextPageSize)
    setPage(1)
  }

  const handlePageChange = (nextPage: number) => {
    setPage(Math.min(Math.max(1, nextPage), totalPages))
  }

  const handleRoutesChange = (nextRouteIds: string[]) => {
    setSelectedRouteIds(nextRouteIds)
    setSelectedTripIds([])
    setPage(1)
  }

  const handleTripsChange = (nextTripIds: string[]) => {
    setSelectedTripIds(nextTripIds)
    setPage(1)
  }

  const clearFilters = () => {
    setSelectedRouteIds([])
    setSelectedTripIds([])
    setPage(1)
  }

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicleId(vehicle.id)
  }

  const closeVehicleDetail = () => {
    setSelectedVehicleId(null)
  }

  const retry = () => {
    void vehiclesQuery.refetch()
    void totalQuery.refetch()
  }

  const error = vehiclesQuery.error ?? totalQuery.error
  const hasFilters = selectedRouteIds.length > 0 || selectedTripIds.length > 0

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-[-0.02em]">Vehicles</h1>
      <div className="mt-4">
        <VehicleFilters
          selectedRouteIds={selectedRouteIds}
          selectedTripIds={selectedTripIds}
          onRoutesChange={handleRoutesChange}
          onTripsChange={handleTripsChange}
          onClear={clearFilters}
        />
      </div>

      <div className="mt-4">
        {vehiclesQuery.isError || totalQuery.isError ? (
          <ErrorState
            message={error instanceof Error ? error.message : 'Could not load vehicles.'}
            onRetry={retry}
          />
        ) : vehiclesQuery.isPending || totalQuery.isPending ?
          <VehicleGridSkeleton count={pageSize} />
          : vehicles.length === 0 ? (
            <div className="rounded-card border border-rule bg-surface p-10 text-center">
              <p className="text-sm text-muted">
                {hasFilters ? 'No vehicles match these filters.' : 'No vehicles found.'}
              </p>
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-3 text-xs text-primary hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <VehicleGrid vehicles={vehicles} onSelect={handleSelectVehicle} />
          )}
      </div>

      {!totalQuery.isPending &&
        !totalQuery.isError &&
        !vehiclesQuery.isError &&
        totalItems !== undefined && (
          <VehiclePagination
            page={currentPage}
            pageSize={pageSize}
            totalItems={totalItems}
            isFetching={vehiclesQuery.isFetching}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}

      <VehicleDetailDialog
        vehicleId={selectedVehicleId}
        onClose={closeVehicleDetail}
      />
    </>
  )
}

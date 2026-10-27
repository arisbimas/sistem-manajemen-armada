import { useQuery } from '@tanstack/react-query'

import { fetchVehiclesPage, fetchVehicleTotal } from '@/api/vehicles'
import type { VehicleFilters } from '@/types/filters'

export function useVehicles(page: number, pageSize: number, filters: VehicleFilters) {
  return useQuery({
    queryKey: ['vehicles', page, pageSize, filters.routeIds, filters.tripIds],
    queryFn: ({ signal }) => fetchVehiclesPage(page, pageSize, filters, signal),
    staleTime: 30_000,
  })
}

export function useVehicleTotal(filters: VehicleFilters) {
  return useQuery({
    queryKey: ['vehicles-total', filters.routeIds, filters.tripIds],
    queryFn: ({ signal }) => fetchVehicleTotal(filters, signal),
    staleTime: 60_000,
  })
}

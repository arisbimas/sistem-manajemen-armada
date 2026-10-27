import { useQuery } from '@tanstack/react-query'

import { fetchVehicleDetail } from '@/api/vehicles'

export function useVehicleDetail(vehicleId: string | null) {
  return useQuery({
    queryKey: ['vehicle', vehicleId],
    queryFn: ({ signal }) => fetchVehicleDetail(vehicleId!, signal),
    enabled: Boolean(vehicleId),
    staleTime: 30_000,
  })
}

import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { fetchTripsPage, getServiceDate } from '@/api/lists'

export function useInfiniteTrips(routeIds: string[], enabled: boolean) {
  const sortedRouteIds = useMemo(() => [...routeIds].sort(), [routeIds])
  const serviceDate = getServiceDate()

  return useInfiniteQuery({
    queryKey: ['trips', sortedRouteIds, serviceDate],
    queryFn: ({ pageParam, signal }) => fetchTripsPage(sortedRouteIds, serviceDate, pageParam, signal),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
    enabled: enabled && sortedRouteIds.length > 0,
    staleTime: 5 * 60_000,
  })
}

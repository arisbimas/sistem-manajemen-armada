import { useInfiniteQuery } from '@tanstack/react-query'

import { fetchRoutesPage } from '@/api/lists'

export function useInfiniteRoutes(enabled: boolean) {
  return useInfiniteQuery({
    queryKey: ['routes'],
    queryFn: ({ pageParam, signal }) => fetchRoutesPage(pageParam, signal),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
    enabled,
    staleTime: 5 * 60_000,
  })
}

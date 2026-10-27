import { useMemo, useState } from 'react'

import { MultiSelect } from '@/components/ui/multi-select'
import { RouteBullet } from '@/components/ui/route-bullet'
import { useInfiniteRoutes } from '@/hooks/use-infinite-routes'
import { useInfiniteTrips } from '@/hooks/use-infinite-trips'
import type { RouteOption, TripOption } from '@/types/filters'

type VehicleFiltersProps = {
  selectedRouteIds: string[]
  selectedTripIds: string[]
  onRoutesChange: (ids: string[]) => void
  onTripsChange: (ids: string[]) => void
  onClear: () => void
}

function renderRouteOption(route: RouteOption) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <RouteBullet
        shortName={route.shortName}
        color={route.color}
        textColor={route.textColor}
        title={route.longName}
      />
      <span className="min-w-0 flex-1 truncate" title={route.longName}>
        {route.longName}
      </span>
      <span className="shrink-0 text-2xs text-muted">{route.mode}</span>
    </span>
  )
}

function renderTripOption(trip: TripOption) {
  return (
    <span className="flex min-w-0 flex-col gap-0.5">
      <span className="flex min-w-0 items-center gap-2">
        <RouteBullet
          shortName={trip.routeShortName}
          color={trip.routeColor}
          textColor={trip.routeTextColor}
          title={trip.routeShortName}
        />
        <span className="min-w-0 flex-1 truncate" title={trip.headsign}>
          {trip.headsign}
        </span>
        <span className="shrink-0 text-2xs text-muted">{trip.directionName}</span>
      </span>
      <span
        className="block truncate pl-7 text-2xs text-muted tabular-nums"
        title={`Trip ${trip.id}`}
      >
        #{trip.id}
      </span>
    </span>
  )
}

function renderRouteTrigger(selected: RouteOption[]) {
  return (
    <span className="flex items-center gap-1">
      {selected.slice(0, 2).map((route) => (
        <RouteBullet
          key={route.id}
          shortName={route.shortName}
          color={route.color}
          textColor={route.textColor}
          title={route.longName}
        />
      ))}
      {selected.length > 2 && <span className="text-muted">+{selected.length - 2}</span>}
    </span>
  )
}

function renderTripTrigger(selected: TripOption[]) {
  if (selected.length === 1) {
    return (
      <span className="truncate" title={`${selected[0].headsign} - Trip ${selected[0].id}`}>
        {selected[0].headsign}
      </span>
    )
  }

  return `${selected.length} trips`
}

export function VehicleFilters({
  selectedRouteIds,
  selectedTripIds,
  onRoutesChange,
  onTripsChange,
  onClear,
}: VehicleFiltersProps) {
  const [routesOpen, setRoutesOpen] = useState(false)
  const [tripsOpen, setTripsOpen] = useState(false)

  const routesQuery = useInfiniteRoutes(routesOpen)
  const tripsQuery = useInfiniteTrips(selectedRouteIds, tripsOpen)

  const routes = useMemo(() => {
    const map = new Map<string, RouteOption>()

    for (const page of routesQuery.data?.pages ?? []) {
      for (const route of page.routes) {
        map.set(route.id, route)
      }
    }

    return [...map.values()]
  }, [routesQuery.data])

  const trips = useMemo(() => {
    const map = new Map<string, TripOption>()

    for (const page of tripsQuery.data?.pages ?? []) {
      for (const trip of page.trips) {
        map.set(trip.id, trip)
      }
    }

    return [...map.values()]
  }, [tripsQuery.data])

  const hasFilters = selectedRouteIds.length > 0 || selectedTripIds.length > 0
  const tripsDisabled = selectedRouteIds.length === 0

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Vehicle filters">
      <MultiSelect
        label="Routes"
        allLabel="All routes"
        options={routes}
        selectedIds={selectedRouteIds}
        onChange={onRoutesChange}
        renderOption={renderRouteOption}
        renderTriggerValue={renderRouteTrigger}
        hasMore={routesQuery.hasNextPage}
        isLoading={routesOpen && routesQuery.isPending}
        isFetchingMore={routesQuery.isFetchingNextPage}
        error={
          routesQuery.isError || routesQuery.isFetchNextPageError
            ? routesQuery.error instanceof Error
              ? routesQuery.error.message
              : 'Could not load routes.'
            : null
        }
        onRetry={() => {
          void routesQuery.refetch()
        }}
        onLoadMore={() => {
          void routesQuery.fetchNextPage()
        }}
        onOpenChange={setRoutesOpen}
        emptyText="No routes found."
      />

      <MultiSelect
        label="Trips"
        allLabel={tripsDisabled ? 'Select a route first' : 'All trips'}
        options={trips}
        selectedIds={selectedTripIds}
        onChange={onTripsChange}
        renderOption={renderTripOption}
        renderTriggerValue={renderTripTrigger}
        disabled={tripsDisabled}
        hasMore={tripsQuery.hasNextPage}
        isLoading={tripsOpen && tripsQuery.isPending}
        isFetchingMore={tripsQuery.isFetchingNextPage}
        error={
          tripsQuery.isError || tripsQuery.isFetchNextPageError
            ? tripsQuery.error instanceof Error
              ? tripsQuery.error.message
              : 'Could not load trips.'
            : null
        }
        onRetry={() => {
          void tripsQuery.refetch()
        }}
        onLoadMore={() => {
          void tripsQuery.fetchNextPage()
        }}
        onOpenChange={setTripsOpen}
        emptyText={
          selectedRouteIds.length > 0
            ? 'No trips for the selected routes.'
            : 'Select a route first.'
        }
      />

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-muted transition-colors hover:text-ink"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}

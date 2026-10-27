import { ApiError, fetchJson } from '@/api/client'
import { toMode, withHash } from '@/lib/transit'
import type {
  IncludedVehicleResource,
  RouteResource,
  StopResource,
  TripResource,
  VehicleDetailResponse,
  VehicleListResponse,
  VehicleResource,
} from '@/types/mbta'
import type { VehicleFilters } from '@/types/filters'
import type { Vehicle, VehicleDetail } from '@/types/vehicle'

const BASE_URL = 'https://api-v3.mbta.com'

function applyFilters(params: URLSearchParams, filters: VehicleFilters) {
  if (filters.tripIds.length > 0) {
    params.set('filter[trip]', filters.tripIds.join(','))
  } else if (filters.routeIds.length > 0) {
    params.set('filter[route]', filters.routeIds.join(','))
  }
}

function mapVehicle(resource: VehicleResource): Vehicle {
  return {
    id: resource.id,
    label: resource.attributes.label,
    current_status: resource.attributes.current_status,
    latitude: resource.attributes.latitude,
    longitude: resource.attributes.longitude,
    updated_at: resource.attributes.updated_at,
  }
}

function parseOffset(link: string) {
  const value = new URL(link, BASE_URL).searchParams.get('page[offset]')

  if (value === null) {
    return null
  }

  const offset = Number(value)
  return Number.isFinite(offset) ? offset : null
}

function indexIncluded(included: IncludedVehicleResource[]) {
  const routes = new Map<string, RouteResource>()
  const trips = new Map<string, TripResource>()
  const stops = new Map<string, StopResource>()

  for (const resource of included) {
    if (resource.type === 'route') {
      routes.set(resource.id, resource)
    } else if (resource.type === 'trip') {
      trips.set(resource.id, resource)
    } else {
      stops.set(resource.id, resource)
    }
  }

  return { routes, trips, stops }
}

export async function fetchVehiclesPage(
  page: number,
  pageSize: number,
  filters: VehicleFilters,
  signal?: AbortSignal,
) {
  const params = new URLSearchParams({
    'filter[revenue]': 'REVENUE',
    'page[limit]': String(pageSize),
    'page[offset]': String((page - 1) * pageSize),
  })

  applyFilters(params, filters)

  const response = await fetchJson<VehicleListResponse>('/vehicles', params, signal)
  return response.data.map(mapVehicle)
}

export async function fetchVehicleTotal(filters: VehicleFilters, signal?: AbortSignal) {
  const params = new URLSearchParams({
    'filter[revenue]': 'REVENUE',
    'fields[vehicle]': 'label',
    'page[limit]': '1',
    'page[offset]': '0',
  })

  applyFilters(params, filters)

  const response = await fetchJson<VehicleListResponse>('/vehicles', params, signal)
  const last = response.links?.last

  if (!last) {
    return response.data.length
  }

  const offset = parseOffset(last)
  return offset === null ? response.data.length : offset + 1
}

export async function fetchVehicleDetail(
  id: string,
  signal?: AbortSignal,
): Promise<VehicleDetail> {
  const params = new URLSearchParams({ include: 'route,trip,stop' })
  let response: VehicleDetailResponse

  try {
    response = await fetchJson<VehicleDetailResponse>(
      `/vehicles/${encodeURIComponent(id)}`,
      params,
      signal,
    )
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw new ApiError(
        'This vehicle is no longer available in the live feed. Close this dialog and refresh the list.',
        404,
      )
    }

    throw error
  }

  const { routes, trips, stops } = indexIncluded(response.included ?? [])
  const vehicle = response.data
  const attributes = vehicle.attributes
  const tripId = vehicle.relationships?.trip?.data?.id ?? null
  const tripResource = tripId ? trips.get(tripId) : undefined
  const routeId =
    vehicle.relationships?.route?.data?.id ??
    tripResource?.relationships?.route?.data?.id ??
    null
  const routeResource = routeId ? routes.get(routeId) : undefined
  const stopId = vehicle.relationships?.stop?.data?.id ?? null
  const stopResource = stopId ? stops.get(stopId) : undefined

  const directionId =
    attributes.direction_id ?? tripResource?.attributes.direction_id ?? 0

  const route = routeResource
    ? {
      shortName: routeResource.attributes.short_name || routeResource.id,
      longName: routeResource.attributes.long_name,
      color: withHash(routeResource.attributes.color, '#64748b'),
      textColor: withHash(routeResource.attributes.text_color, '#ffffff'),
      mode: toMode(routeResource.attributes.type),
      directionName: routeResource.attributes.direction_names?.[directionId] ?? '',
      destination: routeResource.attributes.direction_destinations?.[directionId] ?? '',
    }
    : null

  const trip = tripResource
    ? {
      id: tripResource.id,
      blockId: tripResource.attributes.block_id ?? null,
      wheelchairAccessible: Boolean(tripResource.attributes.wheelchair_accessible),
      bikesAllowed: Boolean(tripResource.attributes.bikes_allowed),
    }
    : null

  const stop = stopResource
    ? {
      name: stopResource.attributes.name,
      platformName: stopResource.attributes.platform_name ?? null,
      municipality: stopResource.attributes.municipality ?? null,
    }
    : null

  return {
    label: attributes.label,
    current_status: attributes.current_status,
    latitude: attributes.latitude,
    longitude: attributes.longitude,
    updated_at: attributes.updated_at,
    speedMps: attributes.speed ?? null,
    occupancyStatus: attributes.occupancy_status ?? null,
    route,
    trip,
    stop,
  }
}

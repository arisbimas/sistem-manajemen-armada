import { fetchJson } from '@/api/client'
import type {
  RouteListResponse,
  RouteResource,
  TripListResponse,
  TripResource,
} from '@/types/mbta'
import type { RouteOption, TransitMode, TripOption } from '@/types/filters'

const BASE_URL = 'https://api-v3.mbta.com'
const PAGE_LIMIT = 50

export function getServiceDate() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date())
}

function parseNextOffset(link: string | null | undefined) {
  if (!link) {
    return null
  }

  const value = new URL(link, BASE_URL).searchParams.get('page[offset]')

  if (value === null) {
    return null
  }

  const offset = Number(value)
  return Number.isFinite(offset) ? offset : null
}

function withHash(value: string, fallback: string) {
  if (!value) {
    return fallback
  }

  return value.startsWith('#') ? value : `#${value}`
}

// reference: https://gtfs.org/documentation/schedule/reference/#routestxt
const MODE_LABELS: Record<number, TransitMode> = {
  0: 'Light rail', // Tram, streetcar, light rail
  1: 'Subway', // Subway, metro
  2: 'Commuter rail', // Rail (MBTA uses this for CR-*)
  3: 'Bus',
  4: 'Ferry',
  5: 'Cable tram',
  6: 'Aerial lift',
  7: 'Funicular',
  11: 'Trolleybus',
  12: 'Monorail',
}

function toMode(type: number): TransitMode {
  return MODE_LABELS[type] ?? 'Other'
}

function mapRoute(resource: RouteResource): RouteOption {
  return {
    id: resource.id,
    shortName: resource.attributes.short_name || resource.id,
    longName: resource.attributes.long_name,
    color: withHash(resource.attributes.color, '#64748b'),
    textColor: withHash(resource.attributes.text_color, '#ffffff'),
    mode: toMode(resource.attributes.type),
    sortOrder: resource.attributes.sort_order ?? 0,
    directionNames: resource.attributes.direction_names ?? [],
  }
}

function mapTrip(resource: TripResource, routes: Map<string, RouteOption>): TripOption | null {
  const routeId = resource.relationships?.route?.data?.id

  if (!routeId) {
    return null
  }

  const route = routes.get(routeId)

  if (!route) {
    return null
  }

  return {
    id: resource.id,
    routeId,
    routeShortName: route.shortName,
    routeColor: route.color,
    routeTextColor: route.textColor,
    headsign: resource.attributes.headsign || route.longName,
    directionName: route.directionNames[resource.attributes.direction_id] ?? '',
  }
}

export async function fetchRoutesPage(offset: number, signal?: AbortSignal) {
  const params = new URLSearchParams({
    'page[limit]': String(PAGE_LIMIT),
    'page[offset]': String(offset),
  })

  const response = await fetchJson<RouteListResponse>('/routes', params, signal)
  return {
    routes: response.data.map(mapRoute),
    nextOffset: parseNextOffset(response.links?.next),
  }
}

export async function fetchTripsPage(
  routeIds: string[],
  serviceDate: string,
  offset: number,
  signal?: AbortSignal,
) {
  const params = new URLSearchParams({
    'filter[route]': routeIds.join(','),
    'filter[date]': serviceDate,
    include: 'route',
    'page[limit]': String(PAGE_LIMIT),
    'page[offset]': String(offset),
  })

  const response = await fetchJson<TripListResponse>('/trips', params, signal)
  const routes = new Map<string, RouteOption>()

  for (const resource of response.included ?? []) {
    if (resource.type === 'route') {
      routes.set(resource.id, mapRoute(resource))
    }
  }

  const trips: TripOption[] = []

  for (const resource of response.data) {
    const trip = mapTrip(resource, routes)

    if (trip) {
      trips.push(trip)
    }
  }

  return {
    trips,
    nextOffset: parseNextOffset(response.links?.next),
  }
}

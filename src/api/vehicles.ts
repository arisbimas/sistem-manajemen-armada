import { fetchJson } from '@/api/client'
import type { VehicleListResponse, VehicleResource } from '@/types/mbta'
import type { VehicleFilters } from '@/types/filters'
import type { Vehicle } from '@/types/vehicle'

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

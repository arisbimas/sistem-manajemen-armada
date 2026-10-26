import { fetchJson } from '@/api/client'
import type { VehicleListResponse, VehicleResource } from '@/types/mbta'
import type { Vehicle } from '@/types/vehicle'

const VEHICLE_FIELDS = 'label,current_status,latitude,longitude,updated_at'
const VEHICLE_LIMIT = 1000

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

/**
 * Single snapshot request. The revenue fleet is well under 1000 vehicles;
 * see the README for the trade-off if that assumption ever changes.
 */
export async function fetchAllVehicles(signal?: AbortSignal) {
  const params = new URLSearchParams({
    'filter[revenue]': 'REVENUE',
    'fields[vehicle]': VEHICLE_FIELDS,
    'page[limit]': String(VEHICLE_LIMIT),
    'page[offset]': '0',
  })

  const response = await fetchJson<VehicleListResponse>('/vehicles', params, signal)
  return response.data.map(mapVehicle)
}

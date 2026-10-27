export type ResourceIdentifier = {
  id: string
  type: string
}

export type VehicleAttributes = {
  label: string
  current_status: string
  latitude: number | null
  longitude: number | null
  updated_at: string
  bearing?: number | null
  speed?: number | null
  direction_id?: 0 | 1
  current_stop_sequence?: number
  occupancy_status?: string | null
  revenue?: string
  carriages?: unknown[]
}

export type VehicleRelationships = {
  route?: { data: ResourceIdentifier | null }
  trip?: { data: ResourceIdentifier | null }
  stop?: { data: ResourceIdentifier | null }
}

export type VehicleResource = {
  id: string
  type: 'vehicle'
  attributes: VehicleAttributes
  relationships?: VehicleRelationships
}

export type RouteAttributes = {
  short_name: string
  long_name: string
  color: string
  text_color: string
  type: number
  sort_order: number
  direction_names: string[]
  direction_destinations?: string[]
}

export type RouteResource = {
  id: string
  type: 'route'
  attributes: RouteAttributes
}

export type TripAttributes = {
  headsign: string
  direction_id: 0 | 1
  block_id?: string | null
  wheelchair_accessible?: number
  bikes_allowed?: number
}

export type TripResource = {
  id: string
  type: 'trip'
  attributes: TripAttributes
  relationships?: {
    route?: { data: ResourceIdentifier | null }
  }
}

export type StopAttributes = {
  name: string
  platform_name?: string | null
  municipality?: string | null
}

export type StopResource = {
  id: string
  type: 'stop'
  attributes: StopAttributes
}

export type IncludedVehicleResource = RouteResource | TripResource | StopResource

export type VehicleListLinks = {
  first?: string | null
  last?: string | null
  next?: string | null
  prev?: string | null
}

export type VehicleListResponse = {
  data: VehicleResource[]
  links?: VehicleListLinks | null
}

export type VehicleDetailResponse = {
  data: VehicleResource
  included?: IncludedVehicleResource[]
}

export type RouteListResponse = {
  data: RouteResource[]
  links?: VehicleListLinks | null
}

export type TripListResponse = {
  data: TripResource[]
  included?: RouteResource[]
  links?: VehicleListLinks | null
}

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
}

export type VehicleResource = {
  id: string
  type: 'vehicle'
  attributes: VehicleAttributes
}

export type RouteAttributes = {
  short_name: string
  long_name: string
  color: string
  text_color: string
  type: number
  sort_order: number
  direction_names: string[]
}

export type RouteResource = {
  id: string
  type: 'route'
  attributes: RouteAttributes
}

export type TripAttributes = {
  headsign: string
  direction_id: 0 | 1
}

export type TripResource = {
  id: string
  type: 'trip'
  attributes: TripAttributes
  relationships?: {
    route?: { data: ResourceIdentifier | null }
  }
}

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

export type RouteListResponse = {
  data: RouteResource[]
  links?: VehicleListLinks | null
}

export type TripListResponse = {
  data: TripResource[]
  included?: RouteResource[]
  links?: VehicleListLinks | null
}

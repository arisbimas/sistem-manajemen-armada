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

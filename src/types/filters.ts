export type TransitMode =
  | 'Light rail'
  | 'Subway'
  | 'Commuter rail'
  | 'Bus'
  | 'Ferry'
  | 'Cable tram'
  | 'Aerial lift'
  | 'Funicular'
  | 'Trolleybus'
  | 'Monorail'
  | 'Other'

export type RouteOption = {
  id: string
  shortName: string
  longName: string
  color: string
  textColor: string
  mode: TransitMode
  sortOrder: number
  directionNames: string[]
  directionDestinations: string[]
}

export type TripOption = {
  id: string
  routeId: string
  routeShortName: string
  routeColor: string
  routeTextColor: string
  headsign: string
  directionName: string
}

export type VehicleFilters = {
  routeIds: string[]
  tripIds: string[]
}

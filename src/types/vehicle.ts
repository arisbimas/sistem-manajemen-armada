import type { TransitMode } from '@/types/filters'

export type VehicleRouteDetail = {
  shortName: string
  longName: string
  color: string
  textColor: string
  mode: TransitMode
  directionName: string
  destination: string
}

export type VehicleTripDetail = {
  id: string
  blockId: string | null
  wheelchairAccessible: boolean
  bikesAllowed: boolean
}

export type VehicleStopDetail = {
  name: string
  platformName: string | null
  municipality: string | null
}

export type Vehicle = {
  id: string
  label: string
  current_status: string
  latitude: number | null
  longitude: number | null
  updated_at: string
}

export type VehicleDetail = {
  label: string
  current_status: string
  latitude: number | null
  longitude: number | null
  updated_at: string
  speedMps: number | null
  occupancyStatus: string | null
  route: VehicleRouteDetail | null
  trip: VehicleTripDetail | null
  stop: VehicleStopDetail | null
}

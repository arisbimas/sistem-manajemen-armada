import type { TransitMode } from '@/types/filters'

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

export function toMode(type: number): TransitMode {
  return MODE_LABELS[type] ?? 'Other'
}

export function withHash(value: string, fallback: string) {
  if (!value) {
    return fallback
  }

  return value.startsWith('#') ? value : `#${value}`
}

import * as Dialog from '@radix-ui/react-dialog'
import * as L from 'leaflet'
import { MapPin, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
const MARKER_HTML = renderToStaticMarkup(
  <span className="grid size-8.5 place-items-center rounded-full border-2 border-primary bg-surface shadow-md">
    <MapPin className="size-4 text-primary" strokeWidth={1.75} />
  </span>,
)

function VehicleMap({
  latitude,
  longitude,
  label,
}: {
  latitude: number
  longitude: number
  label?: string
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    const map = L.map(container, {
      zoomControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
    }).setView([latitude, longitude], 16)

    map.attributionControl.setPosition('topleft')
    map.attributionControl.setPrefix(false)

    L.tileLayer(TILE_URL, {
      maxZoom: 19,
      attribution: TILE_ATTRIBUTION,
    }).addTo(map)

    const icon = L.divIcon({
      className: '',
      html: MARKER_HTML,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    })

    const marker = L.marker([latitude, longitude], { icon, title: label }).addTo(map)

    if (label) {
      marker.bindTooltip(label, {
        direction: 'top',
        offset: [0, -18],
        opacity: 1,
      })
    }

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize()
    })
    resizeObserver.observe(container)

    const frame = window.requestAnimationFrame(() => {
      map.invalidateSize()
    })

    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      map.remove()
    }
  }, [latitude, longitude, label])

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={label ? `Map showing vehicle ${label}` : 'Vehicle position map'}
      className="relative z-0 h-full w-full isolate"
    />
  )
}

function MapFallback({ message }: { message: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(180deg,#f7fafc_0%,#eef3f8_100%)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-3.5 rounded-[9px] border border-dashed border-rule-strong"
      />
      <div
        aria-hidden="true"
        className="relative z-1 flex h-full flex-col items-center justify-center gap-0.5 p-4 text-center"
      >
        <span className="mb-1.5 grid size-8.5 place-items-center rounded-[9px] border border-rule bg-surface text-primary shadow-sm">
          <MapPin className="size-4" />
        </span>
        <span className="text-[11px] font-semibold">{message}</span>
      </div>
    </div>
  )
}

export function VehicleMapHero({
  latitude,
  longitude,
  label,
  isPending,
  isError,
}: {
  latitude: number | null
  longitude: number | null
  label?: string
  isPending: boolean
  isError: boolean
}) {
  const hasPosition = latitude !== null && longitude !== null
  const fallbackMessage = isPending
    ? 'Loading position…'
    : isError
      ? 'Position unavailable'
      : 'Position not reported'

  return (
    <div className="relative isolate h-80 overflow-hidden rounded-t-overlay">
      {hasPosition ? (
        <VehicleMap latitude={latitude} longitude={longitude} label={label} />
      ) : (
        <MapFallback message={fallbackMessage} />
      )}

      <Dialog.Close asChild>
        <button
          type="button"
          aria-label="Close vehicle details"
          className="absolute top-3.5 right-3.5 z-2 grid size-8 place-items-center rounded-control border border-white/80 bg-white/90 text-muted shadow-md cursor-pointer transition-colors hover:bg-paper hover:text-ink"
        >
          <X className="size-4" />
        </button>
      </Dialog.Close>
    </div>
  )
}

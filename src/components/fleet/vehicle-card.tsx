import { formatCoordinate, formatDateTime } from '@/lib/format'
import type { Vehicle } from '@/types/vehicle'

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const hasLocation = vehicle.latitude !== null && vehicle.longitude !== null

  return (
    <article
      className="h-full rounded-card border border-rule bg-surface p-4"
      aria-label={`Vehicle ${vehicle.label}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[26px] leading-none font-semibold tracking-[-0.02em] tabular-nums">
          {vehicle.label}
        </span>

        <span className="shrink-0 rounded-full border border-rule bg-paper px-2 py-0.5 text-2xs text-muted">
          {vehicle.current_status}
        </span>
      </div>

      <dl className="mt-4 space-y-1.5 border-t border-rule pt-3 text-xs">
        <div className="flex items-start justify-between gap-3">
          <dt className="text-muted">Location</dt>
          <dd className="text-right whitespace-nowrap tabular-nums">
            {hasLocation
              ? `${formatCoordinate(vehicle.latitude)}, ${formatCoordinate(vehicle.longitude)}`
              : '—'}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-3">
          <dt className="text-muted">Last update</dt>
          <dd className="text-right whitespace-nowrap">{formatDateTime(vehicle.updated_at)}</dd>
        </div>
      </dl>
    </article>
  )
}

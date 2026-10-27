import { Pill } from '@/components/ui/pill'
import { formatCoordinate, formatDateTime } from '@/lib/format'
import type { Vehicle } from '@/types/vehicle'

type VehicleCardProps = {
  vehicle: Vehicle
  onSelect: (vehicle: Vehicle, trigger: HTMLButtonElement) => void
}

export function VehicleCard({ vehicle, onSelect }: VehicleCardProps) {
  const hasCoordinates = vehicle.latitude !== null && vehicle.longitude !== null

  return (
    <button
      type="button"
      onClick={(event) => onSelect(vehicle, event.currentTarget)}
      aria-label={`View details for vehicle ${vehicle.label}, ${vehicle.current_status}`}
      className="h-full w-full rounded-card border border-rule bg-surface p-4 text-left cursor-pointer transition-colors hover:border-rule-strong"
    >
      <span className="flex w-full items-center justify-between gap-3">
        <span className="text-[26px] leading-none font-semibold tracking-[-0.02em] tabular-nums">
          {vehicle.label}
        </span>

        <Pill>{vehicle.current_status}</Pill>
      </span>

      <span className="mt-4 block border-t border-rule pt-3 text-xs">
        <span className="flex items-start justify-between gap-3">
          <span className="text-muted">Coordinates</span>
          <span className="text-right whitespace-nowrap font-medium text-[12px] tabular-nums">
            {hasCoordinates
              ? `${formatCoordinate(vehicle.latitude)}, ${formatCoordinate(vehicle.longitude)}`
              : '—'}
          </span>
        </span>
        <span className="mt-1.5 flex items-start justify-between gap-3">
          <span className="text-muted">Last update</span>
          <span className="text-right whitespace-nowrap font-medium text-[12px] tabular-nums">
            {formatDateTime(vehicle.updated_at)}
          </span>
        </span>
      </span>
    </button>
  )
}

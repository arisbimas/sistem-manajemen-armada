import * as Dialog from '@radix-ui/react-dialog'

import {
  AccessTags,
  DetailRow,
  DirectionValue,
  Metric,
} from '@/components/fleet/vehicle-detail/vehicle-detail-parts'
import { Pill } from '@/components/ui/pill'
import { RouteBullet } from '@/components/ui/route-bullet'
import { formatCoordinate, formatDateTime, formatSpeed } from '@/lib/format'
import type { VehicleDetail } from '@/types/vehicle'

const OCCUPANCY_LABELS: Record<string, string> = {
  MANY_SEATS_AVAILABLE: 'Many seats available',
  FEW_SEATS_AVAILABLE: 'Few seats available',
  FULL: 'Full',
  NO_DATA_AVAILABLE: 'No data',
}

const SECTION_HEADING =
  "flex items-center gap-2 text-xs font-semibold after:h-px after:flex-1 after:bg-rule after:content-['']"

function occupancyLabel(value: string | null) {
  return value ? (OCCUPANCY_LABELS[value] ?? value) : '—'
}

export function VehicleDetailContent({ detail }: { detail: VehicleDetail }) {
  const stopLabel = detail.current_status === 'STOPPED_AT' ? 'Current stop' : 'Next stop'
  const hasCoordinates = detail.latitude !== null && detail.longitude !== null
  const coordinates = hasCoordinates
    ? `${formatCoordinate(detail.latitude)}, ${formatCoordinate(detail.longitude)}`
    : '—'
  const speed = formatSpeed(detail.speedMps)
  const speedNote = detail.speedMps === null ? 'Not reported' : undefined
  const occupancy = occupancyLabel(detail.occupancyStatus)
  const occupancyNote = detail.occupancyStatus === null ? 'Not reported' : undefined

  return (
    <>
      <div className="relative z-2 mx-2.5 -mt-8.5 flex flex-wrap items-start justify-between gap-3 rounded-overlay border border-rule bg-surface p-3.5 shadow-[0_16px_36px_-22px_rgba(18,59,93,0.45)] sm:-mt-12 sm:mx-6.5 sm:gap-x-5.5 sm:p-4">
        <div className="min-w-0">
          <span className="text-xs text-muted">Vehicle</span>
          <div className="mt-px flex flex-wrap items-center gap-2.5">
            <Dialog.Title asChild>
              <h2 className="text-[38px] leading-none font-semibold tracking-[-0.04em] tabular-nums">
                {detail.label}
              </h2>
            </Dialog.Title>
            <Pill>{detail.current_status || '—'}</Pill>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-muted">Route</span>
            {detail.route ? (
              <RouteBullet
                shortName={detail.route.shortName}
                color={detail.route.color}
                textColor={detail.route.textColor}
              />
            ) : (
              <span className="text-xs text-muted">—</span>
            )}
          </div>
        </div>

        <div className="w-full text-left sm:w-auto sm:pr-0.5 sm:text-right">
          <span className="text-xs text-muted">Coordinates</span>
          <div className="mt-0.5 text-[13px] font-medium tabular-nums">{coordinates}</div>
          <span className="mt-2 block text-xs text-muted">Last update</span>
          <div className="mt-0.5 text-[13px] font-medium tabular-nums">
            {formatDateTime(detail.updated_at)}
          </div>
        </div>
      </div>

      <div className="mx-2.5 mt-3.5 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border border-rule bg-rule sm:mx-6.5">
        <Metric label="Speed" value={speed} note={speedNote} />
        <Metric label="Occupancy" value={occupancy} note={occupancyNote} />
      </div>

      <div className="grid grid-cols-1 gap-4 px-2.5 pt-4.5 sm:grid-cols-2 sm:gap-x-8.5 sm:gap-y-0 sm:px-6.5">
        <section>
          <h3 className={SECTION_HEADING}>Route</h3>
          <dl>
            <DetailRow wide label="Name" value={detail.route?.longName || '—'} />
            <DetailRow label="Mode" value={detail.route?.mode ?? '—'} />
            <DetailRow label="Direction" value={<DirectionValue route={detail.route} />} />
          </dl>
        </section>

        <section className="border-t border-rule pt-3.5 sm:border-t-0 sm:pt-0">
          <h3 className={SECTION_HEADING}>{stopLabel}</h3>
          <dl>
            <DetailRow label="Stop" value={detail.stop?.name ?? '—'} />
            <DetailRow label="Platform" value={detail.stop?.platformName || '—'} />
            <DetailRow label="Municipality" value={detail.stop?.municipality || '—'} />
          </dl>
        </section>
      </div>

      <section className="mx-2.5 mb-5.5 border-rule pt-3.5 sm:mx-6.5">
        <h3 className={SECTION_HEADING}>Trip</h3>
        <div className="mt-2 flex flex-wrap gap-x-8.5 gap-y-3">
          <div>
            <span className="block text-2xs text-muted">Trip ID</span>
            <span className="mt-0.5 block text-xs font-medium tabular-nums">
              {detail.trip?.id ?? '—'}
            </span>
          </div>
          <div>
            <span className="block text-2xs text-muted">Block</span>
            <span className="mt-0.5 block text-xs font-medium tabular-nums">
              {detail.trip?.blockId ?? '—'}
            </span>
          </div>
          <div>
            <span className="block text-2xs text-muted">Accessibility</span>
            {detail.trip ? (
              <AccessTags trip={detail.trip} />
            ) : (
              <span className="mt-0.5 block text-xs text-muted">—</span>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

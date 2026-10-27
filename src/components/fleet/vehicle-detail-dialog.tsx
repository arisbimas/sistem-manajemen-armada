import * as Dialog from '@radix-ui/react-dialog'
import { Accessibility, ArrowRight, Bike, MapPin, X } from 'lucide-react'
import type { ReactNode } from 'react'

import { Pill } from '@/components/ui/pill'
import { RouteBullet } from '@/components/ui/route-bullet'
import { useVehicleDetail } from '@/hooks/use-vehicle-detail'
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

const TAG_CLASS =
  'inline-flex items-center gap-1 rounded border border-rule bg-paper px-1.5 py-0.5 text-xs leading-none font-semibold whitespace-nowrap text-primary-dark'

function occupancyLabel(value: string | null) {
  return value ? (OCCUPANCY_LABELS[value] ?? value) : '—'
}

function DirectionValue({ route }: { route: VehicleDetail['route'] }) {
  if (!route) {
    return <>—</>
  }

  const hasDirection = Boolean(route.directionName)
  const hasDestination = Boolean(route.destination)

  if (!hasDirection && !hasDestination) {
    return <>—</>
  }

  if (!hasDestination) {
    return <span className="text-optical-center">{route.directionName}</span>
  }

  if (!hasDirection) {
    return <span className="text-optical-center">{route.destination}</span>
  }

  return (
    <span className="inline-flex flex-wrap items-center justify-end gap-1.5">
      <span className="text-optical-center">{route.directionName}</span>
      <ArrowRight className="size-3 shrink-0 text-muted" aria-hidden="true" />
      <span className="text-optical-center">{route.destination}</span>
    </span>
  )
}

function MapPlaceholder() {
  return (
    <div className="relative h-43 overflow-hidden rounded-t-overlay bg-[linear-gradient(180deg,#f7fafc_0%,#eef3f8_100%)] sm:h-52.5">
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
        <span className="text-[11px] font-semibold">Map placeholder</span>
      </div>

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

function Metric({
  label,
  value,
  note,
}: {
  label: string
  value: ReactNode
  note?: string
}) {
  return (
    <div className="bg-surface px-3.5 py-2.5">
      <div className="text-2xs text-muted">{label}</div>
      <div className="mt-0.5 text-[15px] leading-tight font-bold tracking-[-0.01em]">
        {value}
      </div>
      {note ? <div className="mt-0.5 text-2xs text-muted">{note}</div> : null}
    </div>
  )
}

function DetailRow({
  label,
  value,
  wide = false,
}: {
  label: string
  value: ReactNode
  wide?: boolean
}) {
  if (wide) {
    return (
      <div className="border-b border-dashed border-rule py-1.75 last:border-0">
        <dt className="text-xs text-muted">{label}</dt>
        <dd className="mt-1 text-[13px] leading-relaxed font-medium">{value}</dd>
      </div>
    )
  }

  return (
    <div className="flex items-baseline justify-between gap-3.5 border-b border-dashed border-rule py-1.5 last:border-0">
      <dt className="shrink-0 text-xs text-muted">{label}</dt>
      <dd className="m-0 min-w-0 text-right text-[13px] font-medium wrap-break-word">
        {value}
      </dd>
    </div>
  )
}

function AccessTags({ trip }: { trip: NonNullable<VehicleDetail['trip']> }) {
  return (
    <div className="mt-1 flex flex-wrap gap-1">
      <span className={TAG_CLASS}>
        <Accessibility className="size-3" aria-hidden="true" />
        <span className="text-optical-center">
          {trip.wheelchairAccessible ? 'Wheelchair accessible' : 'Wheelchair not accessible'}
        </span>
      </span>
      <span className={TAG_CLASS}>
        <Bike className="size-3" aria-hidden="true" />
        <span className="text-optical-center">
          {trip.bikesAllowed ? 'Bikes allowed' : 'Bikes not allowed'}
        </span>
      </span>
    </div>
  )
}

function VehicleDetailContent({ detail }: { detail: VehicleDetail }) {
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

function VehicleDetailSkeleton() {
  return (
    <>
      <p className="sr-only" role="status">
        Loading vehicle details…
      </p>

      <div aria-hidden="true" className="px-2.5 pb-1 sm:px-6.5">
        <div className="relative z-2 -mt-8.5 rounded-overlay border border-rule bg-surface p-3.5 shadow-[0_16px_36px_-22px_rgba(18,59,93,0.45)] sm:-mt-12 sm:p-4">
          <div className="h-3 w-16 animate-pulse rounded bg-rule" />
          <div className="mt-2 flex items-center gap-2.5">
            <div className="h-9 w-24 animate-pulse rounded bg-rule" />
            <div className="h-5 w-20 animate-pulse rounded-full bg-rule/70" />
          </div>
          <div className="mt-2 h-4 w-14 animate-pulse rounded bg-rule" />
        </div>

        <div className="mt-3.5 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border border-rule bg-rule">
          {[0, 1].map((item) => (
            <div key={item} className="bg-surface px-3.5 py-2.5">
              <div className="h-2.5 w-12 animate-pulse rounded bg-rule" />
              <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-rule/70" />
            </div>
          ))}
        </div>

        <div className="mt-4.5 grid gap-4 sm:grid-cols-2 sm:gap-x-8.5">
          {[0, 1].map((block) => (
            <div key={block}>
              <div className="h-3 w-16 animate-pulse rounded bg-rule" />
              <div className="mt-3 space-y-2.5">
                {[0, 1, 2, 3].map((row) => (
                  <div key={row} className="h-3.5 w-full animate-pulse rounded bg-rule/60" />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 mb-5.5 border-t border-rule pt-3.5">
          <div className="h-3 w-12 animate-pulse rounded bg-rule" />
          <div className="mt-3 flex gap-8">
            <div className="h-3.5 w-20 animate-pulse rounded bg-rule/60" />
            <div className="h-3.5 w-20 animate-pulse rounded bg-rule/60" />
            <div className="h-3.5 w-24 animate-pulse rounded bg-rule/60" />
          </div>
        </div>
      </div>
    </>
  )
}

function VehicleDetailError({
  message,
  isRetrying,
  onRetry,
}: {
  message: string
  isRetrying: boolean
  onRetry: () => void
}) {
  return (
    <div className="px-2.5 pb-6 sm:px-6.5">
      <div
        role="alert"
        className="relative z-2 -mt-8.5 rounded-overlay border border-rule bg-surface p-6 text-center shadow-[0_16px_36px_-22px_rgba(18,59,93,0.45)] sm:-mt-12"
      >
        <p className="text-sm font-semibold">Could not load vehicle details</p>
        <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-muted">{message}</p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={isRetrying}
            onClick={onRetry}
            className="inline-flex h-8 items-center rounded-control bg-primary px-3 text-xs font-medium text-white transition-colors hover:bg-primary-dark disabled:cursor-wait disabled:opacity-70"
          >
            {isRetrying ? 'Retrying…' : 'Try again'}
          </button>
          <Dialog.Close asChild>
            <button
              type="button"
              className="inline-flex h-8 items-center rounded-control border border-rule-strong bg-surface px-3 text-xs font-medium text-ink transition-colors hover:bg-paper"
            >
              Close
            </button>
          </Dialog.Close>
        </div>
      </div>
    </div>
  )
}

type VehicleDetailDialogProps = {
  vehicleId: string | null
  onClose: () => void
}

export function VehicleDetailDialog({
  vehicleId,
  onClose,
}: VehicleDetailDialogProps) {
  const query = useVehicleDetail(vehicleId)
  const detail = query.data

  return (
    <Dialog.Root
      open={Boolean(vehicleId)}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-[3px]" />

        <Dialog.Content
          aria-busy={query.isPending}
          className="fixed top-1/2 left-1/2 z-50 max-h-[calc(100dvh-1.25rem)] w-[calc(100vw-1.25rem)] max-w-205 -translate-x-1/2 -translate-y-1/2 overflow-x-hidden overflow-y-auto rounded-overlay bg-surface shadow-overlay focus:outline-none sm:max-h-[calc(100dvh-3rem)] sm:w-[calc(100vw-3rem)]"
        >
          <MapPlaceholder />

          {query.isPending ? (
            <>
              <VehicleDetailSkeleton />
            </>
          ) : query.isError ? (
            <>
              <VehicleDetailError
                message={
                  query.error instanceof Error
                    ? query.error.message
                    : 'Please try again.'
                }
                isRetrying={query.isFetching}
                onRetry={() => {
                  void query.refetch()
                }}
              />
            </>
          ) : detail ? (
            <VehicleDetailContent detail={detail} />
          ) : (
            <Dialog.Title className="sr-only">Vehicle details</Dialog.Title>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

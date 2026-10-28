import { Accessibility, ArrowRight, Bike } from 'lucide-react'
import type { ReactNode } from 'react'

import type { VehicleDetail } from '@/types/vehicle'

const TAG_CLASS =
  'inline-flex items-center gap-1 rounded border border-rule bg-paper px-1.5 py-0.5 text-xs leading-none font-semibold whitespace-nowrap text-primary-dark'

export function DirectionValue({ route }: { route: VehicleDetail['route'] }) {
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

export function Metric({
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

export function DetailRow({
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

export function AccessTags({ trip }: { trip: NonNullable<VehicleDetail['trip']> }) {
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

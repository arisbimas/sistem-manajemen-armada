export function formatCoordinate(value: number | null | undefined) {
  return typeof value === 'number' ? value.toFixed(5) : '—'
}

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZoneName: 'short',
})

export function formatDateTime(iso: string) {
  const date = new Date(iso)

  if (Number.isNaN(date.getTime())) {
    return 'Unknown'
  }

  return dateTimeFormatter.format(date)
}

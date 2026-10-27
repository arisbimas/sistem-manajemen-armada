type RouteBulletProps = {
  shortName: string
  color: string
  textColor: string
  title?: string
}

export function RouteBullet({ shortName, color, textColor, title }: RouteBulletProps) {
  return (
    <span
      className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-[3px] px-1 text-[10px] leading-none font-semibold"
      style={{ backgroundColor: color, color: textColor }}
      title={title}
    >
      {shortName}
    </span>
  )
}

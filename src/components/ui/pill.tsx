import type { ReactNode } from 'react'

type PillProps = {
  children: ReactNode
  className?: string
}

export function Pill({ children, className = '' }: PillProps) {
  return (
    <span
      className={`inline-flex h-5.5 shrink-0 items-center gap-1.5 rounded-full border border-primary/20 bg-primary-soft px-2 text-[10px] leading-none font-bold whitespace-nowrap text-primary-dark ${className}`}
    >
      <span className="text-optical-center">{children}</span>
    </span>
  )
}

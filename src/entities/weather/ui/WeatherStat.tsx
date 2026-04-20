import type { ReactNode } from "react"

type WeatherStatProps = {
  icon: ReactNode
  value: number
  unit?: string
  label: string
  showDivider?: boolean
}

export function WeatherStat({
  icon,
  value,
  unit,
  label,
  showDivider = false,
}: WeatherStatProps) {
  return (
    <div className="relative flex min-w-0 flex-1 flex-col items-center">
      {showDivider ? (
        <span className="absolute right-0 top-1/2 h-2/5 w-px -translate-y-1/2 bg-white/30" />
      ) : null}
      <div className="mb-2">{icon}</div>
      <p className="whitespace-nowrap text-[14px] font-bold">
        {value} {unit}
      </p>
      <p className="text-subtext text-[12px] font-light">{label}</p>
    </div>
  )
}

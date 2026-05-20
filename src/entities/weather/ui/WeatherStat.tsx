import type { ReactNode } from "react"

type WeatherStatProps = {
  icon: ReactNode
  value: number | string
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
    <div className="relative flex min-w-0 flex-1 flex-col items-center ">
      {showDivider ? (
        <span className="absolute right-0 top-1/2 h-2/5 w-px -translate-y-1/2 bg-white/30" />
      ) : null}
      <div className="">{icon}</div>
      <p className="max-w-full truncate text-[12px] font-bold sm:text-[14px]">
        {value}{unit ? ` ${unit}` : ""}
      </p>
      <p className="text-subtext max-w-full truncate text-[11px] font-light sm:text-[12px]">{label}</p>
    </div>
  )
}

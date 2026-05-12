import type { LucideIcon } from "lucide-react"

type UnitSelectProps = {
  label: string
  value: string
  icon?: LucideIcon
  onChange: (value: string) => void
  options: Array<{
    value: string
    label: string
  }>
}

export function UnitSelect({
  label,
  value,
  onChange,
  options,
  icon: Icon,
}: UnitSelectProps) {
  return (
    <label className="flex flex-col gap-3 min-w-0 border-b border-white/10 p-2 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        {Icon ? <Icon /> : null}
        <span className="block min-w-0 truncate text-[14px] font-light text-white">
          {label}
        </span>
      </div>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-lg border border-white/10 bg-[#1F2026] px-3 py-1.5 text-xs text-white outline-none transition focus:border-accent-primary lg:w-[35%]"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
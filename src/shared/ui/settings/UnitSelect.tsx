import { AppDropdown } from "@/shared/ui/dropdown/AppDropdown"
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

      <AppDropdown
        value={value}
        onChange={onChange}
        options={options}
        className="w-full lg:w-[38%]"
        buttonClassName="py-1.5 text-xs"
        menuClassName="min-w-36"
      />
    </label>
  )
}

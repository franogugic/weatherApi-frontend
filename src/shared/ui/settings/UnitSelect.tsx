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
  compact?: boolean
  showChevron?: boolean
}

export function UnitSelect({
  label,
  value,
  onChange,
  options,
  icon: Icon,
  compact = false,
  showChevron = true,
}: UnitSelectProps) {
  return (
    <label className={`flex min-w-0 border-b border-white/10 ${
      compact ? "flex-col gap-1 p-1.5" : "flex-col gap-3 p-2 lg:flex-row lg:items-center lg:justify-between"
    }`}>
      <div className={`flex min-w-0 items-center ${compact ? "gap-1.5" : "gap-3"}`}>
        {Icon ? <Icon size={compact ? 14 : 20} className="shrink-0" /> : null}
        <span className={`block min-w-0 truncate font-light text-white ${
          compact ? "text-[11px]" : "text-[14px]"
        }`}>
          {label}
        </span>
      </div>

      <AppDropdown
        value={value}
        onChange={onChange}
        options={options}
        className={compact ? "w-full" : "w-full lg:w-[38%]"}
        buttonClassName={compact ? "rounded-xl px-2 py-1 text-[11px]" : "py-1.5 text-xs"}
        menuClassName="min-w-36"
        showChevron={showChevron}
      />
    </label>
  )
}

import { useEffect, useRef, useState } from "react"
import { useForecastDays } from "@/features/selected-forecast-days/model/days-context"
import { FORECAST_DAY_OPTIONS } from "@/features/selected-forecast-days/model/days"
import { useTimezone } from "@/features/selected-timezone/model/timezone-context"
import { TIMEZONE_OPTIONS } from "@/features/selected-timezone/model/timezones"

export function SettingsPanel() {
  // koji dropwdon je otvore more bit "timezone", "days" ili null
  const [openDropdown, setOpenDropdown] = useState<"timezone" | "days" | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const { selectedTimezone, setSelectedTimezone } = useTimezone()
  const { selectedForecastDays, setSelectedForecastDays } = useForecastDays()
  const selectedTimezoneLabel =
    TIMEZONE_OPTIONS.find((timezone) => timezone.value === selectedTimezone)?.label ?? "TIME ZONE"
  const selectedForecastDaysLabel =
    FORECAST_DAY_OPTIONS.find((option) => option.value === selectedForecastDays)?.label ?? "Days"

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    // sklanja event listener kad se komponenta ukloni
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div ref={dropdownRef} className="relative ml-auto flex h-fit w-full flex-wrap justify-end gap-3 self-start">
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenDropdown((current) => current === "days" ? null : "days")}
          className="flex gap-2 rounded-2xl bg-linear-to-b from-lightBlue to-blue px-4 py-2 text-white outline-none transition"
        >
          <span className="text-[14px] font-bold">{selectedForecastDaysLabel}</span>
        </button>

        {openDropdown === "days" ? (
          <div className="absolute top-full right-0 z-20 mt-2 min-w-[180px] overflow-y-auto rounded-4xl border border-white/15 bg-white/8 p-4 shadow-lg backdrop-blur-xl">
            {FORECAST_DAY_OPTIONS.map((option, index) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setSelectedForecastDays(option.value)
                  setOpenDropdown(null)
                }}
                className={`w-full rounded-3xl px-3 py-2 text-left capitalize transition ${
                  selectedForecastDays === option.value
                    ? "text-blue"
                    : "text-subtext"
                }`}
              >
                <span>{option.label}</span>
                {index < FORECAST_DAY_OPTIONS.length - 1 && (
                  <div className="mt-3 border-b border-white/50" />
                )}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenDropdown((current) => current === "timezone" ? null : "timezone")}
          className="flex gap-2 rounded-2xl bg-linear-to-b from-lightBlue to-blue px-4 py-2 text-white outline-none transition"
        >
          <span className="text-[14px] font-bold">{selectedTimezoneLabel}</span>
        </button>

        {openDropdown === "timezone" ? (
          <div className="absolute top-full right-0 z-20 mt-2 max-h-48 min-w-[320px] overflow-y-auto rounded-4xl border border-white/15 bg-white/8 p-4 shadow-lg backdrop-blur-xl">
            {TIMEZONE_OPTIONS.map((timezone, index) => (
              <button
                key={timezone.value}
                type="button"
                onClick={() => {
                  setSelectedTimezone(timezone.value)
                  setOpenDropdown(null)
                }}
                className={`w-full rounded-3xl px-3 py-2 text-left transition ${
                  selectedTimezone === timezone.value
                    ? "text-blue"
                    : "text-subtext"
                }`}
              >
                <span>{timezone.label}</span>
                {index < TIMEZONE_OPTIONS.length - 1 && (
                  <div className="mt-3 border-b border-white/50" />
                )}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

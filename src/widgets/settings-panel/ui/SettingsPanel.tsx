import { useEffect, useRef, useState } from "react"
import { useTimezone } from "@/features/selected-timezone/model/timezone-context"
import { TIMEZONE_OPTIONS } from "@/features/selected-timezone/model/timezones"

export function SettingsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const { selectedTimezone, setSelectedTimezone } = useTimezone()
  const selectedTimezoneLabel =
    TIMEZONE_OPTIONS.find((timezone) => timezone.value === selectedTimezone)?.label ?? "TIME ZONE"

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div ref={dropdownRef} className="relative ml-auto h-fit w-fit self-start">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex gap-2 rounded-2xl text-white outline-none transition py-2 px-4 bg-linear-to-b  from-lightBlue to-blue" 
      >
        <span className="text-[14px] font-bold">{selectedTimezoneLabel}</span>
      </button>

      {isOpen ? (
        <div className="absolute top-full right-0 z-20 mt-2 max-h-48 min-w-[320px] overflow-y-auto rounded-4xl border border-white/15 bg-white/8 p-4 shadow-lg backdrop-blur-xl">
          {TIMEZONE_OPTIONS.map((timezone, index) => (
            <button
              key={timezone.value}
              type="button"
              onClick={() => {
                setSelectedTimezone(timezone.value)
                setIsOpen(false)
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
  )
}

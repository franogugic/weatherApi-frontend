import { useLocationStore } from "@/features/location/location-store"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

export function SearchPanel() {
  const { t } = useTranslation()
  const { isLoading, locations, selectedLocation, setSelectedLocation } = useLocationStore()
  const [locationValue, setLocationValue] = useState(selectedLocation?.name ?? "")
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const navigate = useNavigate();

  useEffect(() => {
    setLocationValue(selectedLocation?.name ?? "")
    setHighlightedIndex(-1)
  }, [selectedLocation])

  const filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(locationValue.toLowerCase()),
  )

  const shouldShowDropdown =
    locationValue.trim().length > 0 &&
    filteredLocations.length > 0 &&
    locationValue !== (selectedLocation?.name ?? "")

  useEffect(() => {
    if (!shouldShowDropdown) {
      setHighlightedIndex(-1)
      return
    }

    setHighlightedIndex((current) => {
      if (current < 0) {
        return 0
      }

      // pri smanjenu rezultat pretrage vraca na zadnji element trenutne rpetrage
      return Math.min(current, filteredLocations.length - 1)
    })
  }, [filteredLocations.length, shouldShowDropdown])

  function selectLocationByIndex(index: number) {
    const location = filteredLocations[index]

    if (!location) {
      return
    }

    setSelectedLocation(location)
    setLocationValue(location.name)
    setHighlightedIndex(-1)
    navigate(`/${location.id}`)
  }

  return (
    <div className="relative h-fit min-w-0 self-start rounded-4xl border border-white/10 bg-[#1F2026]/90 px-6 py-5 shadow-[0_8px_22px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl transition hover:border-white/20 hover:bg-[#252a31]/95">
      <div className="flex items-center gap-3">
        <Search size={22} className="text-white/70" />
        <input
          type="text"
          placeholder={t("search.placeholder")}
          disabled={isLoading}
          value={locationValue}
          className="min-w-0 w-full border-none bg-transparent font-extralight text-white placeholder:text-white/40 focus:outline-none"
          onChange={(e) => setLocationValue(e.target.value)}
          onKeyDown={(e) => {
            if (!shouldShowDropdown) {
              return
            }

            if (e.key === "ArrowDown") {
              e.preventDefault()
              setHighlightedIndex((current) =>
                current < filteredLocations.length - 1 ? current + 1 : current,
              )
            }

            if (e.key === "ArrowUp") {
              e.preventDefault()
              setHighlightedIndex((current) => (current > 0 ? current - 1 : 0))
            }

            if (e.key === "Enter") {
              e.preventDefault()
              if (highlightedIndex >= 0) {
                selectLocationByIndex(highlightedIndex)
              }
            }
          }}
        />
      </div>

      {isLoading && (
        <p className="mt-2 text-xs text-white/45">{t("search.loadingLocations")}</p>
      )}

      {/*dropwdon reUltata lokacija*/}
      {shouldShowDropdown && (
        <ul className="absolute left-0 right-0 top-[100%] z-50 mt-2 max-h-72 overflow-y-auto rounded-3xl border border-white/10 bg-[#1F2026]/95 p-2 shadow-[0_18px_45px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-2xl">
          {filteredLocations.map((loc, index) => (
            <li
              key={loc.id}
              className={`cursor-pointer rounded-2xl px-3 py-2.5 transition ${
                index === highlightedIndex
                  ? "bg-linear-to-br from-accent-secondary/22 to-accent-primary/18 text-white"
                  : "text-white/62 hover:bg-white/7 hover:text-white"
              }`}
              onClick={() => {
                setSelectedLocation(loc)
                setLocationValue(loc.name)
                setHighlightedIndex(-1)
                navigate(`/${loc.id}`)
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <p
                className={`text-[14px] font-semibold ${
                  loc.id === selectedLocation?.id
                    ? "text-accent-primary"
                    : "text-inherit"
                }`}
              >
                {loc.name}
              </p>
              <p className="mt-1 text-xs text-white/50">
                {t("search.latitudeShort")} {loc.latitude.toFixed(2)} | {t("search.longitudeShort")}{" "}
                {loc.longitude.toFixed(2)} | {t("search.altitudeShort")} {loc.altitude}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

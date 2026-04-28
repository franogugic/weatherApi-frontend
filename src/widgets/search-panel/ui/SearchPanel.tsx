import { useLocationStore } from "@/features/location/model/location-store"
import { getLocationSlug } from "@/shared/lib/get-lcoation-slug"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

export function SearchPanel() {
  const { t } = useTranslation()
  const { isLoading, locations, selectedLocation, setSelectedLocation } = useLocationStore()
  const [locationValue, setLocationValue] = useState(selectedLocation.name)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const navigate = useNavigate();

  useEffect(() => {
    setLocationValue(selectedLocation.name)
    setHighlightedIndex(-1)
  }, [selectedLocation])

  const filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(locationValue.toLowerCase()),
  )

  const shouldShowDropdown =
    locationValue.trim().length > 0 &&
    filteredLocations.length > 0 &&
    locationValue !== selectedLocation.name

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
    navigate(`/dashboard/${getLocationSlug(location)}`)
  }

  return (
    <div className="bg-div relative h-fit min-w-0 self-start rounded-4xl px-6 py-5">
      <div className="flex items-center gap-2">
        <Search size={22} />
        <input
          type="text"
          placeholder={t("search.placeholder")}
          disabled={isLoading}
          value={locationValue}
          className="min-w-0 w-full bg-transparent border-none font-extralight focus:outline-none"
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
        <ul className="absolute left-0 right-0 top-[100%] z-10 mt-2 max-h-72 overflow-y-auto rounded-4xl border border-white/15 bg-white/8 p-4 shadow-lg backdrop-blur-xl">
          {filteredLocations.map((loc, index) => (
            <li
              key={loc.id}
              className={`cursor-pointer rounded-3xl px-4 py-3 transition ${
                index === highlightedIndex ? "bg-white/5" : ""
              }`}
              onClick={() => {
                setSelectedLocation(loc)
                setLocationValue(loc.name)
                setHighlightedIndex(-1)
                navigate(`/dashboard/${getLocationSlug(loc)}`)
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <p
                className={`text-[14px] font-semibold ${
                  loc.id === selectedLocation.id
                    ? "text-blue "
                    : "text-white"
                }`}
              >
                {loc.name}
              </p>
              <p className="mt-1 text-xs text-white/50">
                {t("search.latitudeShort")} {loc.latitude.toFixed(2)} | {t("search.longitudeShort")}{" "}
                {loc.longitude.toFixed(2)} | {t("search.altitudeShort")} {loc.altitude}
              </p>
              {index < filteredLocations.length - 1 && (
                <div className="mt-3 border-b border-white/50" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

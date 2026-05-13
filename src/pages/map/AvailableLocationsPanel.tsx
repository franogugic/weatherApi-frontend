import type { Location } from "@/entities/location/types"
import { WeatherSymbolIcon } from "@/entities/weather/ui/WeatherSymbolIcon"
import { formatTemperature } from "@/features/unit-preferences/format-units"
import type { TemperatureUnit } from "@/features/unit-preferences/unit-preferences-types"
import { MapPin } from "lucide-react"
import { useTranslation } from "react-i18next"
import { NavLink } from "react-router-dom"

type AvailableLocationsPanelProps = {
  locations: Location[]
  temperatureUnit: TemperatureUnit
}

export function AvailableLocationsPanel({
  locations,
  temperatureUnit,
}: AvailableLocationsPanelProps) {
  const { t } = useTranslation()

  return (
    <div className="flex max-h-[360px] min-h-0 flex-col rounded-4xl bg-div p-4 sm:max-h-[420px] sm:p-6 xl:h-full xl:max-h-none xl:w-[320px] xl:shrink-0">
      <p className="mb-4 bg-linear-to-b from-accent-secondary to-accent-primary bg-clip-text text-center text-xl text-transparent sm:mb-6 sm:text-[26px]">
        {t("map.availableLocations")}
      </p>
      <ul className="min-h-0 flex-1 overflow-y-auto">
        {locations.map((location) => (
          <li key={location.id}>
            <NavLink to={`/${location.id}`} className="block border-y border-white/20 p-4 transition-colors hover:bg-white/8">
              <div className="mb-2 flex items-center justify-start gap-2">
                <span><MapPin className="text-accent-primary" /></span>
                <p className="text-base font-semibold sm:text-[18px]">{location.name}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1 text-[12px] font-semibold">
                  <p><span className="text-subtext font-light">{t("map.latitude")}:</span> {location.latitude}</p>
                  <p><span className="text-subtext font-light">{t("map.longitude")}:</span> {location.longitude}</p>
                  <p><span className="text-subtext font-light">{t("map.altitude")}:</span> {location.altitude}</p>
                </div>
                <div className="flex min-w-[64px] flex-col items-center gap-0 text-center">
                  {location.currentWeather?.weatherSymbol ? (
                    <WeatherSymbolIcon
                      symbol={location.currentWeather.weatherSymbol}
                      className="w-10"
                    />
                  ) : null}
                  {location.currentWeather?.airTemperature !== null &&
                  location.currentWeather?.airTemperature !== undefined ? (
                    <p className="-mt-1 text-[18px] font-semibold leading-none text-white">
                      {formatTemperature(location.currentWeather.airTemperature, temperatureUnit)}
                    </p>
                  ) : (
                    <p className="text-[12px] text-subtext">--</p>
                  )}
                </div>
              </div>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

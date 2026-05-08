import { useLocationStore } from "@/features/location/location-store"
import { MapView, type MapMarker } from "@/shared/ui/map/MapView"
import { MessageState } from "@/shared/ui/status/MessageState"
import { useTranslation } from "react-i18next"
import { NavLink, useNavigate } from "react-router-dom"
import { MapPageSkeleton } from "./MapPageSkeleton"
import { useUnitPreferenceStore } from "@/features/unit-preferences/unit-preference-store"
import { formatTemperature } from "@/features/unit-preferences/format-units"
import { MapPin } from "lucide-react"
import { WeatherSymbolIcon } from "@/entities/weather/ui/WeatherSymbolIcon"

type MapPageProps = {
  showAuthActions?: boolean
}

export function MapPage({ showAuthActions = false }: MapPageProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const locations = useLocationStore((state) => state.locations)
  const isLoading = useLocationStore((state) => state.isLoading)
  const temperatureUnit = useUnitPreferenceStore((state) => state.preferences.temperatureUnit)
  const mapMarkers: MapMarker[] = locations.map((location) => ({
    ...location,
    weatherSymbol: location.currentWeather?.weatherSymbol ?? undefined,
    temperatureText:
      location.currentWeather?.airTemperature !== null &&
      location.currentWeather?.airTemperature !== undefined
        ? formatTemperature(location.currentWeather.airTemperature, temperatureUnit)
        : undefined,
  }))

  if (isLoading) {
    return <MapPageSkeleton />
  }

  if (!locations.length) {
    return (
      <div className="rounded-4xl bg-div p-6">
        <MessageState message={t("map.noLocations")} />
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-bold sm:text-2xl">{t("map.title")}</h1>
        {showAuthActions ? (
          <div className="flex items-center gap-2">
            <NavLink
              to="/login"
              className="rounded-2xl border border-white/10 px-4 py-2 text-[14px] font-semibold text-white/80 transition hover:border-white/20 hover:text-white"
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className="rounded-2xl bg-linear-to-b from-accent-secondary to-accent-primary px-4 py-2 text-[14px] font-semibold text-white shadow-sm transition hover:brightness-110"
            >
              Register
            </NavLink>
          </div>
        ) : null}
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-4 xl:flex-row">
        <div className="min-h-[320px] overflow-hidden rounded-4xl md:min-h-[420px] xl:min-h-0 xl:flex-1">
          <MapView
            markers={mapMarkers}
            zoom={7}
            onMarkerClick={(marker) => navigate(`/${marker.id}`)}
          />
        </div>

        <div className="flex max-h-[360px] min-h-0 flex-col rounded-4xl bg-div p-4 sm:max-h-[420px] sm:p-6 xl:h-full xl:max-h-none xl:w-[320px] xl:shrink-0">
          <p className="mb-4 bg-linear-to-b from-accent-secondary to-accent-primary bg-clip-text text-center text-xl text-transparent sm:mb-6 sm:text-[26px]">
            {t("map.availableLocations")}
          </p>
          <ul className="min-h-0 flex-1 overflow-y-auto">
          {locations.map((location) => (
            <li key={location.id} >
              <NavLink to={`/${location.id}`} className="block border-y border-white/20 p-4 transition-colors hover:bg-white/8">
                <div className="flex items-center justify-start mb-2 gap-2">
                  <span><MapPin className="text-accent-primary"/></span>
                  <p className="text-base font-semibold sm:text-[18px]">{location.name}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-[12px] font-semibold flex flex-col gap-1">
                    <p><span className="text-subtext  font-light">{t("map.latitude")}:</span> {location.latitude}</p>
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
      </div>
    </div>
  )
}

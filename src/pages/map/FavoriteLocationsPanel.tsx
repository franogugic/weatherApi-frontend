import type { Location } from "@/entities/location/types"
import { WeatherSymbolIcon } from "@/entities/weather/ui/WeatherSymbolIcon"
import { formatTemperature } from "@/features/unit-preferences/format-units"
import type { TemperatureUnit } from "@/features/unit-preferences/unit-preferences-types"
import { MapPin } from "lucide-react"
import { NavLink } from "react-router-dom"
import { useTranslation } from "react-i18next"

type FavoriteLocationsPanelProps = {
  locations: Location[]
  temperatureUnit: TemperatureUnit
  isLoading: boolean
}

export function FavoriteLocationsPanel({
  locations,
  temperatureUnit,
  isLoading,
}: FavoriteLocationsPanelProps) {
  const { t } = useTranslation()
  return (
    <div className="relative z-10 shrink-0 overflow-visible rounded-4xl bg-div p-4">
      <div className="relative z-0 mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="bg-linear-to-b from-accent-secondary to-accent-primary bg-clip-text text-[20px] font-semibold text-transparent">
            {t("favorites.title")}
          </p>
          <p className="text-[12px] text-subtext font-light">
            {isLoading ? t("favorites.loading") : t("favorites.quickAccess")}
          </p>
        </div>
        <NavLink
          to="/settings"
          className="relative shrink-0 overflow-hidden rounded-full bg-linear-to-r from-accent-secondary to-accent-primary px-3 py-1.5 text-[14px] font-semibold text-white shadow-[0_8px_18px_rgba(0,0,0,0.18)] transition hover:brightness-110"
        >
          <span className="absolute inset-0 bg-black/25" />
          <span className="relative z-10">{t("favorites.edit")}</span>
        </NavLink>
      </div>

      {locations.length ? (
        <div className="relative z-20 grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-3 overflow-visible px-1 pb-2 md:grid-flow-col md:auto-cols-[minmax(180px,220px)] md:grid-cols-none md:overflow-x-auto">
          {locations.map((location) => (
            <NavLink
              key={location.id}
              to={`/${location.id}`}
              className="group/card relative z-0 flex min-h-[104px] min-w-0 flex-col justify-between rounded-[20px] border border-white/10 bg-[#2b2f36]/70 p-3 text-left shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.03)] backdrop-blur-xl transition duration-200 ease-out hover:z-50 hover:-translate-y-0.5 hover:border-white/15 hover:bg-[#303640]/75"
            >
              <div className="pointer-events-none absolute left-1/2 top-0 z-[999] w-[220px] -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-2xl border border-white/10 bg-[#20252c]/95 p-3 opacity-0 shadow-[0_14px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl transition duration-200 group-hover/card:opacity-100">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                  {t("favorites.coordinates")}
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-light text-subtext">{t("map.latitude")}</span>
                    <span className="bg-linear-to-r from-accent-secondary to-accent-primary bg-clip-text text-xs font-semibold text-transparent">
                      {location.latitude}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-light text-subtext">{t("map.longitude")}</span>
                    <span className="bg-linear-to-r from-accent-secondary to-accent-primary bg-clip-text text-xs font-semibold text-transparent">
                      {location.longitude}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-light text-subtext">{t("map.altitude")}</span>
                    <span className="bg-linear-to-r from-accent-secondary to-accent-primary bg-clip-text text-xs font-semibold text-transparent">
                      {location.altitude ?? "--"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={16} className="shrink-0 text-accent-primary" />
                <p className="line-clamp-1 text-[14px] font-semibold text-white/90">
                  {location.name}
                </p>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  {location.currentWeather?.airTemperature !== null &&
                  location.currentWeather?.airTemperature !== undefined ? (
                    <p className="text-[24px] font-semibold leading-none text-white">
                      {formatTemperature(location.currentWeather.airTemperature, temperatureUnit)}
                    </p>
                  ) : (
                    <p className="text-[24px] font-semibold leading-none text-white">--</p>
                  )}
                </div>

                {location.currentWeather?.weatherSymbol ? (
                  <WeatherSymbolIcon
                    symbol={location.currentWeather.weatherSymbol}
                    className="w-12 drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)]"
                  />
                ) : null}
              </div>
            </NavLink>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[132px] items-center justify-center">
          <p className="text-center text-[18px] font-extralight text-subtext">
            {t("favorites.empty")} <span className="cursor-pointer bg-linear-to-r from-accent-secondary to-accent-primary bg-clip-text text-transparent">{t("favorites.addNow")}</span>!
          </p>
        </div>
      )}
    </div>
  )
}

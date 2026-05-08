import { CloudRain, Droplets, MapPin, Wind } from "lucide-react"
import type {
  WeatherForecastItem,
  WeatherMeta,
} from "@/entities/weather/model/types"
import { WeatherSymbolIcon } from "@/entities/weather/ui/WeatherSymbolIcon"
import { WeatherStat } from "@/entities/weather/ui/WeatherStat"
import { formatShortDate } from "@/shared/lib/format-date"
import { useTranslation } from "react-i18next"
import { useLocationStore } from "@/features/location/location-store"
import { useUnitPreferenceStore } from "@/features/unit-preferences/unit-preference-store"
import {
  convertTemperature,
  formatPrecipitation,
  formatWindSpeed,
  getTemperatureUnitLabel,
} from "@/features/unit-preferences/format-units"

type CurrentForecastPanelProps = {
  forecast: WeatherForecastItem
  meta: WeatherMeta
}


export function CurrentForecastPanel({
  forecast,
  meta,
}: CurrentForecastPanelProps) {
  const { t, i18n } = useTranslation()
  const locale = i18n.language === "hr" ? "hr-HR" : "en-GB"
  const formattedDate = formatShortDate(new Date(), locale)
  const selectedLocation = useLocationStore((state) => state.selectedLocation)
  const temperatureUnit = useUnitPreferenceStore((state) => state.preferences.temperatureUnit)
  const windSpeedUnit = useUnitPreferenceStore((state) => state.preferences.windSpeedUnit)
  const precipitationUnit = useUnitPreferenceStore((state) => state.preferences.precipitationUnit)
  const locationName = selectedLocation?.name ?? t("forecast.locationUnavailable")
  const displayedTemperature = convertTemperature(forecast.airTemperature, temperatureUnit)

  return (
    <div className="lg:row-span-2 flex min-w-0 flex-col justify-between rounded-4xl bg-linear-to-b from-accent-secondary to-accent-primary p-6">
      <div className="text-[14px]">
        <p>{t("currentForecast.todayLabel", { date: formattedDate })}</p>
        <div className="flex flex-wrap items-center gap-1 text-[14px] font-bold">
          <MapPin className="w-6" />
          <p className="break-words">{locationName}</p>
        </div>
      </div>

      <div className="mx-auto text-center">
        <div className="flex translate-y-2 flex-wrap items-end justify-center gap-1 text-5xl font-bold 2xl:text-6xl">
          <p className="text-6xl font-bold 2xl:text-7xl">
            {Math.round(displayedTemperature * 10) / 10}
          </p>
          <p className="text-3xl font-semibold 2xl:text-4xl">
            {getTemperatureUnitLabel(temperatureUnit)}
          </p>
        </div>
        <WeatherSymbolIcon
          symbol={forecast.weatherSymbol}
          className="w-46 mx-auto -translate-y-8"
        />
      </div>

      <div className="mx-auto flex w-full flex-wrap gap-y-4 lg:flex-nowrap">
        <WeatherStat
          icon={<Wind size={34} />}
          value={formatWindSpeed(forecast.windSpeed, windSpeedUnit)}
          label={t("currentForecast.wind")}
          showDivider
        />
        <WeatherStat
          icon={<Droplets size={34} />}
          value={forecast.humidity}
          unit={meta.relative_humidity?.unitDisplayName}
          label={t("currentForecast.humidity")}
          showDivider
        />
        <WeatherStat
          icon={<CloudRain size={34} />}
          value={formatPrecipitation(forecast.precipitationAmount, precipitationUnit)}
          label={t("currentForecast.precipitation")}
        />
      </div>
    </div>
  )
}

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
  const temperatureUnitLabel = meta.air_temperature?.unitDisplayName
  const windSpeedUnitLabel = meta.wind_speed?.unitDisplayName
  const precipitationUnitLabel = meta.precipitation_amount?.unitDisplayName

  return (
    <div className="flex h-full w-full min-w-0 flex-col justify-between overflow-hidden rounded-4xl bg-linear-to-b from-accent-secondary to-accent-primary px-4 py-4 sm:px-5 lg:px-6 lg:py-5">
      <div className="shrink-0 text-[13px] leading-tight sm:text-[14px]">
        <p>{t("currentForecast.todayLabel", { date: formattedDate })}</p>
        <div className="flex min-w-0 items-center gap-1 text-[13px] font-bold sm:text-[14px]">
          <MapPin className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
          <p className="truncate">{locationName}</p>
        </div>
      </div>

      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col items-center justify-center text-center">
        <div className="translate-y-[clamp(0.8rem,2.1vh,1.75rem)] flex flex-wrap items-end justify-center gap-1 font-bold">
          <p className="text-[clamp(2.6rem,6.8vh,5rem)] leading-none font-bold">
            {Math.round(displayedTemperature * 10) / 10}
          </p>
          <p className="text-[clamp(1.55rem,3.6vh,2.5rem)] leading-none font-semibold">
            {getTemperatureUnitLabel(temperatureUnit, temperatureUnitLabel)}
          </p>
        </div>
        <WeatherSymbolIcon
          symbol={forecast.weatherSymbol}
          className="mx-auto w-[clamp(6.25rem,15.5vh,11.5rem)] -translate-y-[clamp(0.8rem,2.1vh,1.75rem)]"
        />
      </div>

      <div className="flex w-full shrink-0 flex-nowrap gap-y-2">
        <WeatherStat
          icon={<Wind size={28} />}
          value={formatWindSpeed(forecast.windSpeed, windSpeedUnit, windSpeedUnitLabel)}
          label={t("currentForecast.wind")}
          showDivider
      
        />
        <WeatherStat
          icon={<Droplets size={28} />}
          value={forecast.humidity}
          unit={meta.relative_humidity?.unitDisplayName}
          label={t("currentForecast.humidity")}
          showDivider
        />
        <WeatherStat
          icon={<CloudRain size={28} />}
          value={formatPrecipitation(forecast.precipitationAmount, precipitationUnit, precipitationUnitLabel)}
          label={t("currentForecast.precipitation")}
        />
      </div>
    </div>
  )
}

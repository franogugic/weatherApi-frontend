import { useForecastStore } from "@/features/get-weather-forecast/forecast-store"
import { getForecastDaily } from "@/shared/lib/get-forecast-daily"
import { useMemo } from "react"
import { capitalizeFirstLetter, CROATIA_TIME_ZONE } from "@/shared/lib/format-date"
import { useTranslation } from "react-i18next"
import { WeatherSymbolIcon } from "@/entities/weather/ui/WeatherSymbolIcon"
import { useUnitPreferenceStore } from "@/features/unit-preferences/unit-preference-store"
import {
  formatPrecipitation,
  formatTemperature,
  formatWindSpeed,
} from "@/features/unit-preferences/format-units"
import { CloudRain, Droplets, Wind } from "lucide-react"

function parseDailyDate(dateString: string) {
  return new Date(`${dateString}T00:00:00Z`)
}

function formatDailyDateLabel(dateString: string, locale: string) {
  const todayKey = new Date().toLocaleDateString("en-CA", {
    timeZone: CROATIA_TIME_ZONE,
  })

  if (dateString === todayKey) {
    return `${formatShortDate(parseDailyDate(dateString), locale)}`
  }

  return formatShortDate(parseDailyDate(dateString), locale)
}

export function DailyForecastsPanel (){
    const { forecast } = useForecastStore()
    const { t, i18n } = useTranslation()
    const locale = i18n.language === "hr" ? "hr-HR" : "en-GB"
    const temperatureUnit = useUnitPreferenceStore((state) => state.preferences.temperatureUnit)
    const windSpeedUnit = useUnitPreferenceStore((state) => state.preferences.windSpeedUnit)
    const precipitationUnit = useUnitPreferenceStore((state) => state.preferences.precipitationUnit)
    const dailyForecasts = useMemo(() => getForecastDaily(forecast), [forecast])


    return(
        <div className="bg-div rounded-4xl h-full flex flex-col gap-2 p-6">
            <div>
              <p className=" text-[22px] font-semibold">{dailyForecasts.length}-Day Forecast</p>
            </div>
            <div className="flex justify-between items-center gap-4 mt-4">
                {dailyForecasts.map((daily, index) => (
                    <div
                        key={daily.date}
                        className={`relative flex-1 flex-col gap-1 text-center ${
                          index > 0 ? "before:absolute before:left-[-0.5rem] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-white/10" : ""
                        }`}
                    >
                        <p className="font-semibold">{getDayLabel(daily.date, locale, t("graph.today"))}</p>
                        <p className="text-[13px] text-white/40">{formatDailyDateLabel(daily.date, locale)}</p>
                        <WeatherSymbolIcon symbol={daily.weatherSymbol} className="w-10 drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)] py-4"/>
                        <div className="flex flex-col gap-1">
                            <p className="font-semibold bg-linear-to-r from-accent-secondary to-accent-primary bg-clip-text text-transparent">{formatTemperature(daily.maxTemperature, temperatureUnit)}</p>
                            <p className="font-light text-[13px]">{formatTemperature(daily.minTemperature, temperatureUnit)}</p>
                        </div>
                        <div className="mt-3 space-y-1 text-[10px] font-light leading-tight text-white/45">
                            <div className="flex items-center justify-center gap-1"><Wind size={16}/> <span className="text-white font-semibold">{formatWindSpeed(daily.windSpeed, windSpeedUnit)}</span></div>
                            <div className="flex items-center justify-center gap-1"><Droplets size={16}/> <span className="text-white font-semibold">{daily.humidity}%</span></div>
                            <div className="flex items-center justify-center gap-1"><CloudRain size={16}/> <span className="text-white font-semibold">{formatPrecipitation(daily.precipitation, precipitationUnit)}</span></div>
                        </div>
                     </div>
                 ))}
            </div>            
        </div>
            
    )
}

function formatShortDate(date: Date, locale = "en-GB") {
  // tipa 02 May
  return date.toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    timeZone: CROATIA_TIME_ZONE,
  })
}

function getDayLabel(
  dateString: string,
  locale: string,
  todayLabel: string,
  firstDateString?: string,) {
  const date = parseDailyDate(dateString)
  const firstDate = firstDateString ? parseDailyDate(firstDateString) : null
  const todayKey = new Date().toLocaleDateString("en-CA", { timeZone: CROATIA_TIME_ZONE })
  const currentDay = date.toLocaleDateString("en-CA", { timeZone: CROATIA_TIME_ZONE })
  const firstDay = firstDate
    ? firstDate.toLocaleDateString("en-CA", { timeZone: CROATIA_TIME_ZONE })
    : null
  const sameDay = currentDay === todayKey || (firstDay && currentDay === firstDay)

  if (sameDay) {
    return todayLabel
  }

  return capitalizeFirstLetter(
    date.toLocaleDateString(locale, {
      weekday: "short",
      timeZone: CROATIA_TIME_ZONE,
    }),
  )
}

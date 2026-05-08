import { useMemo, useState } from "react"
import { CalendarDays, Cloud, CloudRain, Droplets, Gauge, MoveUp, Thermometer } from "lucide-react"
import { CROATIA_TIME_ZONE, formatShortDate } from "@/shared/lib/format-date"
import { parseForecastDate } from "@/shared/lib/parse-forecast-date"
import { useTranslation } from "react-i18next"
import { getWeatherSymbolInfo } from "@/entities/weather/model/weather-symbols"
import { useLocationStore } from "@/features/location/location-store"
import { useForecastStore } from "@/features/get-weather-forecast/forecast-store"
import { WeatherSymbolIcon } from "@/entities/weather/ui/WeatherSymbolIcon"
import { MessageState } from "@/shared/ui/status/MessageState"
import { getForecastDaily } from "@/shared/lib/get-forecast-daily"
import { ForecastPageSkeleton } from "./ForecastPageSkeleton"
import { useUnitPreferenceStore } from "@/features/unit-preferences/unit-preference-store"
import {
  formatCloudiness,
  formatPrecipitation,
  formatPressure,
  formatTemperature,
  formatWindSpeed,
} from "@/features/unit-preferences/format-units"

function getDateKey(dateString: string) {
  return parseForecastDate(dateString).toLocaleDateString("en-CA", {
    timeZone: CROATIA_TIME_ZONE,
  })
}

function formatHourLabel(dateString: string, locale: string) {
  return parseForecastDate(dateString).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: CROATIA_TIME_ZONE,
  })
}

function formatDailyDateLabel(dateString: string, locale: string, todayLabel: string) {
  const todayKey = new Date().toLocaleDateString("en-CA", {
    timeZone: CROATIA_TIME_ZONE,
  })

  if (dateString === todayKey) {
    return `${todayLabel}, ${formatShortDate(new Date(`${dateString}T00:00:00Z`), locale)}`
  }

  return formatShortDate(new Date(`${dateString}T00:00:00Z`), locale)
}

function getWeatherSymbolLabel(symbol: string, t: (key: string) => string) {
  const weatherInfo = getWeatherSymbolInfo(symbol)

  return t(`weatherSymbols.kind.${weatherInfo.kind}`)
}

export function ForecastPage() {
  const { t, i18n } = useTranslation()
  const { forecast, meta, isLoading } = useForecastStore()
  const { selectedLocation } = useLocationStore()
  const temperatureUnit = useUnitPreferenceStore((state) => state.preferences.temperatureUnit)
  const windSpeedUnit = useUnitPreferenceStore((state) => state.preferences.windSpeedUnit)
  const pressureUnit = useUnitPreferenceStore((state) => state.preferences.pressureUnit)
  const cloudinessUnit = useUnitPreferenceStore((state) => state.preferences.cloudinessUnit)
  const precipitationUnit = useUnitPreferenceStore((state) => state.preferences.precipitationUnit)
  const locale = i18n.language === "hr" ? "hr-HR" : "en-GB"

  const dailyForecasts = useMemo(() => getForecastDaily(forecast), [forecast])

  // lista za sve datume koji forecast vraca
  const dateOptions = useMemo(
    () =>
      dailyForecasts.map((daily) => ({
        key: daily.date,
      })),
    [dailyForecasts],
  )

  const [selectedDateKey, setSelectedDateKey] = useState<string>("")
  const selectedDate = dateOptions.some((option) => option.key === selectedDateKey)
    ? selectedDateKey
    : dateOptions[0]?.key ?? ""

  const selectedDayForecast = useMemo(
    () =>
      forecast.filter(
        (item) => getDateKey(item.forecastTime) === selectedDate,
      ),
    [forecast, selectedDate],
  )

  const now = new Date()
  const currentForecast =
    [...forecast]
      .reverse()
      .find((item) => parseForecastDate(item.forecastTime) <= now) ?? forecast[0]

  const currentDateIndex = dateOptions.findIndex((option) => option.key === selectedDate)
  const hasPreviousDay = currentDateIndex > 0
  const hasNextDay = currentDateIndex < dateOptions.length - 1
  
  function goToPreviousDay() {  
    if (hasPreviousDay) {
      setSelectedDateKey(dateOptions[currentDateIndex - 1].key)
    }
  }

  function goToNextDay() {    
    if (hasNextDay) {
      setSelectedDateKey(dateOptions[currentDateIndex + 1].key)
    }
  }

  if (isLoading) {
    return <ForecastPageSkeleton />
  }

  if (!forecast.length || !currentForecast) {
    return (
      <div className="flex h-full min-w-0 flex-1 flex-col rounded-4xl bg-div p-6">
        <MessageState message={t("forecast.noData")} />
      </div>
    )
  }

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col overflow-y-auto rounded-4xl bg-div p-6">
      <div className="mb-8">
        <h2 className="mb-8 break-words text-3xl font-semibold tracking-tight sm:text-4xl">
          {selectedLocation?.name ?? t("forecast.locationUnavailable")}
        </h2>
        <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
          {dailyForecasts.map((daily) => {
            const isActive = selectedDate === daily.date

            return (
              <button
                key={daily.date}
                type="button"
                onClick={() => setSelectedDateKey(daily.date)}
                className={`flex min-h-[320px] cursor-pointer flex-col gap-4 rounded-[22px] border p-[18px] text-left backdrop-blur-xl transition duration-200 ease-out hover:-translate-y-0.5 ${
                  isActive
                    ? "border-accent-primary bg-[#202832]/80 shadow-[0_16px_36px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08),0_0_0_1px_rgba(73,116,239,0.45)]"
                    : "border-white/10 bg-[#2b2f36]/70 shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.03)] hover:border-white/15 hover:bg-[#303640]/75"
                }`}
              >
                <div className="flex items-center justify-center gap-2 text-center text-[15px] font-semibold tracking-wide text-white/90">
                  <CalendarDays size={16} className={isActive ? "text-accent-primary" : "text-white/70"} />
                  <span>{formatDailyDateLabel(daily.date, locale, t("common.today"))}</span>
                </div>

                <div className="flex flex-1 items-center justify-center gap-6 w-full">
                  <WeatherSymbolIcon symbol={daily.weatherSymbol} className="w-20 drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)]" />
                  <div>
                    <p className="text-[46px] font-semibold leading-none tracking-tight text-white">
                      {formatTemperature(daily.averageTemperature, temperatureUnit)}
                    </p>
                    <p className="mt-3 text-center text-sm text-white/70">
                      <span className="font-semibold text-[#4da3ff]">min {formatTemperature(daily.minTemperature, temperatureUnit)}</span>
                      <span className="px-3 text-white/50">|</span>
                      <span className="font-semibold text-[#ff6b6b]">max {formatTemperature(daily.maxTemperature, temperatureUnit)}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 border-t border-white/10 text-sm text-white/85 w-full">
                  <div className="flex items-center gap-3 border-b border-white/10 py-3">
                    <Gauge size={18} className="text-white/75" />
                    <div>
                      <p className="font-medium">{formatPressure(daily.pressure, pressureUnit)}</p>
                      <p className="text-xs text-white/55">{t("forecast.pressure")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 border-b border-white/10 py-3 pl-4">
                    <Droplets size={18} className="text-white/75" />
                    <div>
                      <p className="font-medium">{daily.humidity} {meta.relative_humidity?.unitDisplayName}</p>
                      <p className="text-xs text-white/55">{t("forecast.humidity")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 border-b border-white/10 py-3">
                    <Cloud size={18} className="text-white/75" />
                    <div>
                      <p className="font-medium">{formatCloudiness(daily.cloudiness, cloudinessUnit)}</p>
                      <p className="text-xs text-white/55">{t("forecast.clouds")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 border-b border-white/10 py-3 pl-4">
                    <MoveUp size={18} className="rotate-45 text-white/75" />
                    <div>
                      <p className="font-medium">{formatWindSpeed(daily.windSpeed, windSpeedUnit)}</p>
                      <p className="text-xs text-white/55">{t("forecast.wind")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 py-3">
                    <CloudRain size={18} className="text-[#4da3ff]" />
                    <div>
                      <p className="font-medium">{formatPrecipitation(daily.precipitation, precipitationUnit)}</p>
                      <p className="text-xs text-white/55">{t("forecast.precipitation")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 py-3 pl-4">
                    <Thermometer size={18} className="text-[#ff6b6b]" />
                    <div>
                      <p className="font-medium">{getWeatherSymbolLabel(daily.weatherSymbol, t)}</p>
                      <p className="text-xs text-white/55">{t("forecast.weather")}</p>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
        {/*<p className="text-[14px] text-subtext underline cursor-pointer">show on map</p> */}
      </div>

      {/*<div className="mb-8 flex flex-col items-center justify-center">
        <p className="mb-2 text-[20px] font-extralight">{t("forecast.currentConditions")}</p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {currentForecast?.weatherSymbol ? (
            <WeatherSymbolIcon symbol={currentForecast.weatherSymbol} className="w-16" />
          ) : null}
          <div className="flex items-center justify-between">
            <Thermometer size={40} className="fill-red-400" />
            <p className="text-[28px] font-semibold">
              {currentForecast?.airTemperature}{" "}
              <span className="text-[20px] font-medium">
                {meta.air_temperature?.unitDisplayName}
              </span>
            </p>
          </div>
          <div className="flex items-center justify-between">
            <CloudRain size={40} className="fill-blue-400" />
            <p className="text-[28px] font-semibold">
              {currentForecast?.precipitationAmount}{" "}
              <span className="text-[20px] font-medium">
                {meta.precipitation_amount?.unitDisplayName}
              </span>
            </p>
          </div>
          <div className="flex items-center justify-between">
            <Wind size={40} className="fill-blue-200" />
            <p className="text-[28px] font-semibold">
              {currentForecast?.windSpeed}{" "}
              <span className="text-[20px] font-medium">
                {meta.wind_speed?.unitDisplayName}
              </span>
            </p>
          </div>
        </div>
      </div>  */}

      <div className="rounded-3xl py-4">
        <div className="overflow-x-auto">
          <div className="min-w-[860px]">
            <div className="mb-3 grid grid-cols-[110px_80px_1fr_1fr_1fr_1fr_1fr_1fr] px-3 text-[12px] text-subtext">
              <p>{t("forecast.time")}</p>
              <p>{t("forecast.weather")}</p>
              <p>{t("forecast.temp")}</p>
              <p>{t("forecast.pressure")}</p>
              <p>{t("forecast.clouds")}</p>
              <p>{t("forecast.humidity")}</p>
              <p>{t("forecast.precipitation")}</p>
              <p>{t("forecast.wind")}</p>
            </div>

            <div className="space-y-2">
              {selectedDayForecast.map((item) => (
                <div
                  key={item.forecastTime}
                  className="grid grid-cols-[110px_80px_1fr_1fr_1fr_1fr_1fr_1fr] items-center border-b-[1px] border-white/20 px-3 py-2"
                >
                  <div>
                    {item.forecastTime === currentForecast.forecastTime
                      ? <p className="w-fit rounded-3xl bg-linear-to-br from-accent-secondary to-accent-primary px-2 font-bold">NOW</p>
                      : formatHourLabel(item.forecastTime, locale)}
                  </div>
                  <WeatherSymbolIcon symbol={item.weatherSymbol} className="w-10" />
                  <p>
                    {formatTemperature(item.airTemperature, temperatureUnit)}
                  </p>
                  <p>
                    {formatPressure(item.airPressureAtSeaLevel, pressureUnit)}
                  </p>
                  <p>
                    {formatCloudiness(item.cloudiness, cloudinessUnit)}
                  </p>
                  <p>
                    {item.humidity} {meta.relative_humidity?.unitDisplayName}
                  </p>
                  <p>
                    {formatPrecipitation(item.precipitationAmount, precipitationUnit)}
                  </p>
                  <div className="flex items-center gap-2">
                    <MoveUp
                      size={16}
                      style={{ transform: `rotate(${item.windDirection}deg)` }}
                    />
                    <p>
                      {formatWindSpeed(item.windSpeed, windSpeedUnit)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
                <button onClick={goToPreviousDay} disabled={!hasPreviousDay} className="disabled:opacity-0 underline cursor-pointer bg-linear-to-r from-accent-secondary to-accent-primary bg-clip-text text-transparent">
                    &larr; {t("forecast.previousDay")}
                </button>

                <button onClick={goToNextDay} disabled={!hasNextDay} className="disabled:opacity-0 underline cursor-pointer bg-linear-to-r from-accent-secondary to-accent-primary bg-clip-text text-transparent">
                    {t("forecast.nextDay")} &rarr;
                </button>
        </div>
    </div>
  )
}

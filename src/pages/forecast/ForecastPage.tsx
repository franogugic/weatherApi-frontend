import { useEffect, useMemo, useState } from "react"
import { CloudRain, MoveUp, Thermometer, Wind } from "lucide-react"
import { capitalizeFirstLetter, CROATIA_TIME_ZONE } from "@/shared/lib/format-date"
import { parseForecastDate } from "@/shared/lib/parse-forecast-date"
import { useTranslation } from "react-i18next"
import { useLocationStore } from "@/features/location/location-store"
import { useForecastStore } from "@/features/get-weather-forecast/forecast-store"

function getDateKey(dateString: string) {
  return parseForecastDate(dateString).toLocaleDateString("en-CA", {
    timeZone: CROATIA_TIME_ZONE,
  })
}

function formatDateLabel(dateString: string, locale: string) {
  return capitalizeFirstLetter(
    parseForecastDate(dateString).toLocaleDateString(locale, {
      weekday: "long",
      day: "2-digit",
      month: "short",
      timeZone: CROATIA_TIME_ZONE,
    }),
  )
}

function formatHourLabel(dateString: string, locale: string) {
  return parseForecastDate(dateString).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: CROATIA_TIME_ZONE,
  })
}

export function ForecastPage() {
  const { t, i18n } = useTranslation()
  const { forecast, meta, isLoading } = useForecastStore()
  const { selectedLocation } = useLocationStore()
  const locale = i18n.language === "hr" ? "hr-HR" : "en-GB"

  // lista za sve datume koji forecast vraca
  const dateOptions = useMemo(() => {
    const uniqueDates = new Map<string, string>()

    forecast.forEach((item) => {
      const key = getDateKey(item.forecastTime)

      if (!uniqueDates.has(key)) {
        uniqueDates.set(key, item.forecastTime)
      }
    })

    return Array.from(uniqueDates.entries()).map(([key, value]) => ({
      key,
      label: formatDateLabel(value, locale),
    }))
  }, [forecast, locale])

  const [selectedDate, setSelectedDate] = useState<string>("")

  useEffect(() => {
    if (!dateOptions.length) {
      setSelectedDate("")
      return
    }

    // provjera ako trenutni datum ne psotji vise u listi
    if (!selectedDate || !dateOptions.some((option) => option.key === selectedDate)) {
      setSelectedDate(dateOptions[0].key)
    }
  }, [dateOptions, selectedDate])

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
      setSelectedDate(dateOptions[currentDateIndex - 1].key)
    }
  }

  function goToNextDay() {    
    if (hasNextDay) {
      setSelectedDate(dateOptions[currentDateIndex + 1].key)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full min-w-0 flex-1 flex-col rounded-4xl bg-div p-6">
        <div className="mb-8">
          <h2 className="text-4xl">{selectedLocation.name}</h2>
        </div>
        <div className="flex flex-1 items-center justify-center text-white/55">
          {t("forecast.loading")}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col rounded-4xl bg-div p-6">
      <div className="mb-8">
        <h2 className="break-words text-3xl sm:text-4xl">{selectedLocation.name}</h2>
        {/*<p className="text-[14px] text-subtext underline cursor-pointer">show on map</p> */}
      </div>

      <div className="mb-8 flex flex-col items-center justify-center">
        <p className="mb-2 text-[20px] font-extralight">{t("forecast.currentConditions")}</p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <img
            src={`/${currentForecast?.weatherSymbol}.svg`}
            alt={t("common.weatherIconAlt")}
            className="w-16"
          />
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
      </div>

      <div className="mb-4 overflow-x-auto">
        <div className="flex min-w-max items-center justify-center divide-x divide-white/20  px-4">
          {dateOptions.map((option) => (
            <button
              key={option.key}
              type="button" 
              onClick={() => setSelectedDate(option.key)}
              className={`cursor-pointer  px-8 py-2 text-sm font-semibold whitespace-nowrap  transition ${
                selectedDate === option.key ? "text-accent-primary " : "text-white"
              }`}
            >
               {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto rounded-3xl py-4">
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
                  <p>{formatHourLabel(item.forecastTime, locale)}</p>
                  <img
                    src={`/${item.weatherSymbol}.svg`}
                    alt={t("common.weatherIconAlt")}
                    className="w-10"
                  />
                  <p>
                    {item.airTemperature} {meta.air_temperature?.unitDisplayName}
                  </p>
                  <p>
                    {item.airPressureAtSeaLevel} {meta.air_pressure_at_sea_level?.unitDisplayName}
                  </p>
                  <p>
                    {item.cloudiness} {meta.cloud_area_fraction?.unitDisplayName}
                  </p>
                  <p>
                    {item.humidity} {meta.relative_humidity?.unitDisplayName}
                  </p>
                  <p>
                    {item.precipitationAmount} {meta.precipitation_amount?.unitDisplayName}
                  </p>
                  <div className="flex items-center gap-2">
                    <MoveUp
                      size={16}
                      style={{ transform: `rotate(${item.windDirection}deg)` }}
                    />
                    <p>
                      {item.windSpeed} {meta.wind_speed?.unitDisplayName}
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

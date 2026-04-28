import { useEffect, useMemo, useRef, useState } from "react"
import { CloudRain, MoveUp, Thermometer, Wind } from "lucide-react"
import { useForecast } from "@/features/get-weather-forecast/model/forecast-context"
import { useLocation } from "@/features/location/model/location-context"
import { parseForecastDate } from "@/shared/lib/parse-forecast-date"

function getDateKey(dateString: string) {
  return parseForecastDate(dateString).toLocaleDateString("en-CA")
}

function formatDateLabel(dateString: string) {
  return parseForecastDate(dateString).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "short",
  })
}

function formatHourLabel(dateString: string) {
  return parseForecastDate(dateString).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

export function ForecastPage() {
  const { forecast, meta, isLoading } = useForecast()
  const { selectedLocation } = useLocation()

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
      label: formatDateLabel(value),
    }))
  }, [forecast])

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

  // dropdown
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false)
  const dateDropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dateDropdownRef.current &&
        event.target instanceof Node &&
        !dateDropdownRef.current.contains(event.target)
      ) {
        setIsDateDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

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
          Loading forecast...
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
        <p className="mb-2 text-[20px] font-extralight">Current conditions</p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <img
            src={`/${currentForecast?.weatherSymbol}.svg`}
            alt="weather icon"
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
            <Wind size={40} className="fill-blue-300" />
            <p className="text-[28px] font-semibold">
              {currentForecast?.windSpeed}{" "}
              <span className="text-[20px] font-medium">
                {meta.wind_speed?.unitDisplayName}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div ref={dateDropdownRef} className="relative mb-4 ml-auto h-fit w-fit self-start">
        <button
          type="button"
          onClick={() => setIsDateDropdownOpen((current) => !current)}
          className="flex gap-2 rounded-2xl bg-linear-to-b from-lightBlue to-blue px-4 py-2 text-white outline-none transition"
        >
          <span className="text-[14px] font-bold">
            {dateOptions.find((option) => option.key === selectedDate)?.label ?? "DATE"}
          </span>
        </button>

        {isDateDropdownOpen ? (
          <div className="absolute top-full right-0 z-20 mt-2 max-h-48 min-w-[320px] overflow-y-auto rounded-4xl border border-white/15 bg-white/8 p-4 shadow-lg backdrop-blur-xl">
            {dateOptions.map((option, index) => (
              <button
                key={option.key}
                type="button"
                onClick={() => {
                  setSelectedDate(option.key)
                  setIsDateDropdownOpen(false)
                }}
                className={`w-full rounded-3xl px-3 py-2 text-left transition ${
                  selectedDate === option.key
                    ? "text-blue"
                    : "text-subtext"
                }`}
              >
                <span>{option.label}</span>
                {index < dateOptions.length - 1 && (
                  <div className="mt-3 border-b border-white/50" />
                )}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto rounded-3xl py-4">
        <div className="overflow-x-auto">
          <div className="min-w-[860px]">
            <div className="mb-3 grid grid-cols-[110px_80px_1fr_1fr_1fr_1fr_1fr_1fr] px-3 text-[12px] text-subtext">
              <p>Time</p>
              <p>Weather</p>
              <p>Temp</p>
              <p>Pressure</p>
              <p>Clouds</p>
              <p>Humidity</p>
              <p>Precipitation</p>
              <p>Wind</p>
            </div>

            <div className="space-y-2">
              {selectedDayForecast.map((item) => (
                <div
                  key={item.forecastTime}
                  className="grid grid-cols-[110px_80px_1fr_1fr_1fr_1fr_1fr_1fr] items-center border-b-[1px] border-white/20 px-3 py-2"
                >
                  <p>{formatHourLabel(item.forecastTime)}</p>
                  <img
                    src={`/${item.weatherSymbol}.svg`}
                    alt="weather icon"
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
                <button onClick={goToPreviousDay} disabled={!hasPreviousDay} className="disabled:opacity-0 underline cursor-pointer bg-linear-to-r from-lightBlue to-blue bg-clip-text text-transparent">
                    &larr; Previous day 
                </button>

                <button onClick={goToNextDay} disabled={!hasNextDay} className="disabled:opacity-0 underline cursor-pointer bg-linear-to-r from-blue to-lightBlue bg-clip-text text-transparent">
                    Next day &rarr;
                </button>
        </div>
    </div>
  )
}

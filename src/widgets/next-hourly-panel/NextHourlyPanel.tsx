import type { WeatherForecastItem, WeatherMeta } from "@/entities/weather/model/types"
import { useLocationStore } from "@/features/location/location-store"
import { CROATIA_TIME_ZONE } from "@/shared/lib/format-date"
import { parseForecastDate } from "@/shared/lib/parse-forecast-date"
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next"

type NextHourlyPanelProps = {
  forecast: WeatherForecastItem[],
  meta: WeatherMeta;
  
}

export function NextHourlysPanel( {forecast, meta}: NextHourlyPanelProps) {
  const { t, i18n } = useTranslation()
  const selectedLocation = useLocationStore((state) => state.selectedLocation)
  const locale = i18n.language === "hr" ? "hr-HR" : "en-GB"
  
  return (
  <div className="xl:row-span-2 flex h-full min-h-0 min-w-0 flex-col rounded-4xl bg-div p-6">
    <div className="mb-4 flex items-center justify-between">
      <p className="text-[22px] font-semibold">{t("nextHourly.title")}</p>
      <NavLink to={`/forecast/${selectedLocation.id}`} className="text-[14px] underline cursor-pointer bg-linear-to-t from-accent-secondary to-accent-primary bg-clip-text text-transparent">
          {t("nextHourly.seeMore")}
      </NavLink>
    </div>

    <div className="mb-2 flex items-center justify-between px-2">
      <p className="text-[12px] text-subtext">{t("nextHourly.time")}</p>
      <p className="text-[12px] text-subtext">{t("nextHourly.weather")}</p>
      <p className="text-[12px] text-subtext">{t("nextHourly.temp")}</p>
    </div>

    <div
      className="grid flex-1"
      style={{ gridTemplateRows: `repeat(${forecast.length}, minmax(0, 1fr))` }}
    >
      {forecast.map((item, index) => (
        <div key={index} className="grid h-full grid-cols-3 items-center px-2">
          <p className="font-light">{getHourFromForecastTime(item.forecastTime, locale)}</p>
          <img
            src={`/${item.weatherSymbol}.svg`}
            alt={t("common.weatherIconAlt")}
            className="w-10 mx-auto"
          />
          <p className="font-light text-end">{item.airTemperature} {meta.air_temperature?.unitDisplayName}</p>
        </div>
      ))}
    </div>

    <NavLink to={`/forecast/${selectedLocation.id}`} className="mt-4 text-[18px] font-extralight">
      <div className="bg-linear-to-b flex items-center justify-center from-accent-secondary to-accent-primary rounded-4xl py-2 cursor-pointer">
        {t("nextHourly.seeAll")}
      </div>
    </NavLink>
  </div>
  )
}


function getHourFromForecastTime(dateString: string, locale: string) {
  return parseForecastDate(dateString).toLocaleTimeString(locale, {
    hour: "2-digit",
    hour12: false,
    timeZone: CROATIA_TIME_ZONE,
  })
}

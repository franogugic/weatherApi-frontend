import { useForecastStore } from "@/features/get-weather-forecast/forecast-store"
import { parseForecastDate } from "@/shared/lib/parse-forecast-date"
import { CurrentForecastPanel } from "@/widgets/current-forecast-panel/CurrentForecastPanel"
import { GraphPanel } from "@/widgets/graph-panel/GraphPanel"
import { MapPanel } from "@/widgets/map-panel/MapPanel"
import { NextHourlysPanel } from "@/widgets/next-hourly-panel/NextHourlyPanel"
import { SearchPanel } from "@/widgets/search-panel/SearchPanel"
import { SettingsPanel } from "@/widgets/settings-panel/SettingsPanel"
import { useTranslation } from "react-i18next"

export function DashboardPage() {
  const { t } = useTranslation()
  const {forecast, meta, isLoading} = useForecastStore()

  if (isLoading) {
    return (
      <div className="grid min-h-full min-w-0 grid-cols-1 gap-5 xl:h-full xl:grid-cols-[minmax(0,29fr)_minmax(0,33fr)_minmax(0,38fr)] xl:grid-rows-[auto_minmax(0,1fr)_minmax(0,1fr)] [@media(min-width:1280px)_and_(max-height:820px)]:h-auto [@media(min-width:1280px)_and_(max-height:820px)]:grid-cols-1 [@media(min-width:1280px)_and_(max-height:820px)]:grid-rows-none">
        <SearchPanel />
        <div className="hidden rounded-4xl bg-div xl:block" />
        <SettingsPanel />
        <div className="row-span-2 rounded-4xl bg-div p-6 text-white/55">{t("forecast.loading")}</div>
        <div className="rounded-4xl bg-div" />
        <div className="col-span-2 rounded-4xl bg-div p-6 text-white/55">{t("forecast.loading")}</div>
      </div>
    )
  }

  const now = new Date()
  const forecastItems = forecast ?? []
  // uzima timeslot koji je najlbize sdasnjostia. da je vec prosa
  const currentForecast =
    [...forecastItems]
      .reverse()
      .find((item) => parseForecastDate(item.forecastTime) <= now) ?? forecastItems[0]

  // odvaja za next 12.. samo buduce
  const nextHourlyForecast = forecastItems
    .filter((item) => parseForecastDate(item.forecastTime) > now)
    .slice(0, 12)

  return (
    <div className="grid min-h-full min-w-0 grid-cols-1 gap-5 xl:h-full xl:grid-cols-[minmax(0,29fr)_minmax(0,33fr)_minmax(0,38fr)] xl:grid-rows-[auto_minmax(0,1fr)_minmax(0,1fr)] [@media(min-width:1280px)_and_(max-height:820px)]:h-auto [@media(min-width:1280px)_and_(max-height:820px)]:grid-cols-1 [@media(min-width:1280px)_and_(max-height:820px)]:grid-rows-none">
      <SearchPanel />
      {currentForecast && meta ? (
        <CurrentForecastPanel forecast={currentForecast} meta={meta} />
      ) : null}
      <SettingsPanel />
      {forecast[0] && meta ? (
        <NextHourlysPanel forecast={nextHourlyForecast} meta={meta} />
      ) : null}
      <div className="hidden xl:block">
        <MapPanel />
      </div>
      <GraphPanel forecast={forecast ?? []} meta={meta ?? {}} />
    </div>
  )
}

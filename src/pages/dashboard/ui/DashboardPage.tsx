import { useForecast } from "@/features/get-weather-forecast/model/forecast-context"
import { parseForecastDate } from "@/shared/lib/parse-forecast-date"
import { CurrentForecastPanel } from "@/widgets/current-forecast-panel/ui/CurrentForecastPanel"
import { GraphPanel } from "@/widgets/graph-panel/ui/GraphPanel"
import { MapPanel } from "@/widgets/map-panel/ui/MapPanel"
import { NextHourlysPanel } from "@/widgets/next-hourly-panel/ui/NextHourlyPanel"
import { SearchPanel } from "@/widgets/search-panel/ui/SearchPanel"
import { SettingsPanel } from "@/widgets/settings-panel/ui/SettingsPanel"

export function DashboardPage() {
  const {forecast, meta, isLoading} = useForecast()

  if (isLoading) {
    return (
      <div className="grid min-h-full min-w-0 grid-cols-1 gap-5 xl:h-full xl:grid-cols-[minmax(0,29fr)_minmax(0,33fr)_minmax(0,38fr)] xl:grid-rows-[auto_minmax(0,1fr)_minmax(0,1fr)]">
        <SearchPanel />
        <div className="bg-div rounded-4xl" />
        <SettingsPanel />
        <div className="row-span-2 rounded-4xl bg-div p-6 text-white/55">Loading forecast...</div>
        <div className="rounded-4xl bg-div" />
        <div className="col-span-2 rounded-4xl bg-div p-6 text-white/55">Loading forecast...</div>
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
    <div className="grid min-h-full min-w-0 grid-cols-1 gap-5 xl:h-full xl:grid-cols-[minmax(0,29fr)_minmax(0,33fr)_minmax(0,38fr)] xl:grid-rows-[auto_minmax(0,1fr)_minmax(0,1fr)]">
      <SearchPanel />
      {currentForecast && meta ? (
        <CurrentForecastPanel forecast={currentForecast} meta={meta} />
      ) : null}
      <SettingsPanel />
      {forecast[0] && meta ? (
        <NextHourlysPanel forecast={nextHourlyForecast} meta={meta} />
      ) : null}
      <MapPanel />
      <GraphPanel forecast={forecast ?? []} meta={meta ?? {}} />
    </div>
  )
}

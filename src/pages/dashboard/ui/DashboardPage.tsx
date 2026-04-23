import { useForecast } from "@/features/get-weather-forecast/model/forecast-context"
import { parseForecastDate } from "@/shared/lib/parse-forecast-date"
import { CurrentForecastPanel } from "@/widgets/current-forecast-panel/ui/CurrentForecastPanel"
import { GraphPanel } from "@/widgets/graph-panel/ui/GraphPanel"
import { MapPanel } from "@/widgets/map-panel/ui/MapPanel"
import { NextHourlysPanel } from "@/widgets/next-hourly-panel/ui/NextHourlyPanel"
import { SearchPanel } from "@/widgets/search-panel/ui/SearchPanel"
import { SettingsPanel } from "@/widgets/settings-panel/ui/SettingsPanel"

export function DashboardPage() {
  const {forecast, meta} = useForecast()
  const now = new Date()
  const forecastItems = forecast ?? []
  const currentForecast =
    [...forecastItems]
      .reverse()
      .find((item) => parseForecastDate(item.forecastTime) <= now) ?? forecastItems[0]
  const nextHourlyForecast = forecastItems
    .filter((item) => parseForecastDate(item.forecastTime) > now)
    .slice(0, 12)

  return (
    <div className="grid h-full min-h-0 grid-cols-[29fr_33fr_38fr] grid-rows-[8fr_45fr_47fr] gap-5">
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

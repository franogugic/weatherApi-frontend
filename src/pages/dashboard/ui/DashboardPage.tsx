import { useWeatherForecast } from "@/features/get-weather-forecast/model/useWeatherForecast"
import { useLocation } from "@/features/selected-location/model/location-context"
import { parseForecastDate } from "@/shared/lib/parse-forecast-date"
import { CurrentForecastPanel } from "@/widgets/current-forecast-panel/ui/CurrentForecastPanel"
import { GraphPanel } from "@/widgets/graph-panel/ui/GraphPanel"
import { MapPanel } from "@/widgets/map-panel/ui/MapPanel"
import { NextHourlysPanel } from "@/widgets/next-hourly-panel/ui/NextHourlyPanel"
import { SearchPanel } from "@/widgets/search-panel/ui/SearchPanel"
import { SettingsPanel } from "@/widgets/settings-panel/ui/SettingsPanel"

export function DashboardPage() {
  const { selectedLocation } = useLocation()
  const data = useWeatherForecast(selectedLocation.id)
  const now = new Date()
  const forecastItems = data?.items ?? []
  const currentForecast =
    [...forecastItems]
      .reverse()
      .find((item) => parseForecastDate(item.forecastTime) <= now) ?? forecastItems[0]
  const nextHourlyForecast = forecastItems
    .filter((item) => parseForecastDate(item.forecastTime) > now)
    .slice(0, 12)

  return (
    <div className="grid h-full min-h-0 grid-cols-[29fr_33fr_38fr] grid-rows-[8fr_45fr_47fr] gap-5 overflow-hidden">
      <SearchPanel />
      {currentForecast && data?.meta ? (
        <CurrentForecastPanel forecast={currentForecast} meta={data.meta} />
      ) : null}
      <SettingsPanel />
      {data?.items?.[0] && data?.meta ? (
        <NextHourlysPanel forecast={nextHourlyForecast} meta={data.meta} />
      ) : null}
      <MapPanel />
      <GraphPanel forecast={data?.items ?? []} meta={data?.meta ?? {}} />
    </div>
  )
}

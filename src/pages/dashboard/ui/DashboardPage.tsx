import { useWeatherForecast } from "@/features/get-weather-forecast/model/useWeatherForecast"
import { CurrentForecastPanel } from "@/widgets/current-forecast-panel/ui/CurrentForecastPanel"
import { GraphPanel } from "@/widgets/graph-panel/ui/GraphPanel"
import { MapPanel } from "@/widgets/map-panel/ui/MapPanel"
import { NextHourlysPanel } from "@/widgets/next-hourly-panel/ui/NextHourlyPanel"
import { SearchPanel } from "@/widgets/search-panel/ui/SearchPanel"
import { SettingsPanel } from "@/widgets/settings-panel/ui/SettingsPanel"

export function DashboardPage() {
  const data = useWeatherForecast(102)

  return (
    <div className="grid h-full grid-cols-[29fr_33fr_38fr] grid-rows-[8fr_45fr_47fr] gap-5">
      <SettingsPanel />
      {data?.items?.[0] && data?.meta ? (
        <CurrentForecastPanel forecast={data.items[0]} meta={data.meta} />
      ) : null}
      <SearchPanel />
      <NextHourlysPanel forecast={data?.items.slice(0,12) ?? []} />
      <MapPanel />
      <GraphPanel />
    </div>
  )
}

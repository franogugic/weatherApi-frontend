import { useForecastStore } from "@/features/get-weather-forecast/forecast-store"
import { parseForecastDate } from "@/shared/lib/parse-forecast-date"
import { CurrentForecastPanel } from "@/widgets/current-forecast-panel/CurrentForecastPanel"
import { GraphPanel } from "@/widgets/graph-panel/GraphPanel"
import { MapPanel } from "@/widgets/map-panel/MapPanel"
import { NextHourlysPanel } from "@/widgets/next-hourly-panel/NextHourlyPanel"
import { SearchPanel } from "@/widgets/search-panel/SearchPanel"
import { SettingsPanel } from "@/widgets/settings-panel/SettingsPanel"
import { LoadingState } from "@/shared/ui/status/LoadingState"
import { MessageState } from "@/shared/ui/status/MessageState"
import { useTranslation } from "react-i18next"

export function DashboardPage() {
  const { t } = useTranslation()
  const {forecast, meta, isLoading} = useForecastStore()

  if (isLoading) {
    return (
      <div className="rounded-4xl bg-div p-6">
        <LoadingState message={t("forecast.loading")} />
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

  if (!forecastItems.length || !currentForecast) {
    return (
      <div className="rounded-4xl bg-div p-6">
        <MessageState message={t("forecast.noData")} />
      </div>
    )
  }

  return (
    <div className="grid min-h-full min-w-0 grid-cols-1 gap-5 lg:h-full lg:grid-cols-[minmax(0,29fr)_minmax(0,33fr)_minmax(0,38fr)] lg:grid-rows-[auto_minmax(0,1fr)_minmax(0,1fr)]">
      <SearchPanel />
      {currentForecast && meta ? (
        <CurrentForecastPanel forecast={currentForecast} meta={meta} />
      ) : null}
      <SettingsPanel />
      {forecast[0] && meta ? (
        <NextHourlysPanel forecast={nextHourlyForecast} meta={meta} />
      ) : null}
      <div className="hidden lg:block">
        <MapPanel />
      </div>
      <GraphPanel forecast={forecast ?? []} meta={meta ?? {}} />
    </div>
  )
}

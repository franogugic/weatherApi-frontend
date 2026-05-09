import { useForecastStore } from "@/features/get-weather-forecast/forecast-store"
import { useAuthStore } from "@/features/auth/auth-store"
import { parseForecastDate } from "@/shared/lib/parse-forecast-date"
import { SearchPanel } from "@/widgets/search-panel/SearchPanel"
import { SettingsPanel } from "@/widgets/settings-panel/SettingsPanel"
import { MessageState } from "@/shared/ui/status/MessageState"
import { useTranslation } from "react-i18next"
import { DashboardPageSkeleton } from "./DashboardPageSkeleton"
import { DashboardWidgetGrid } from "./DashboardWidgetGrid"

export function DashboardPage() {
  const { t } = useTranslation()
  const {forecast, meta, isLoading} = useForecastStore()
  const user = useAuthStore((state) => state.user)


  if (isLoading) {
    return <DashboardPageSkeleton />
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
      {meta ? (
        <DashboardWidgetGrid
          currentForecast={currentForecast}
          forecast={forecastItems}
          nextHourlyForecast={nextHourlyForecast}
          meta={meta}
          user={user}
          afterFirstWidget={<SettingsPanel user={user} />}
        />
      ) : null}
    </div>
  )
}

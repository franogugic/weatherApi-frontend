import { useForecastStore } from "@/features/get-weather-forecast/forecast-store"
import { useAuthStore } from "@/features/auth/auth-store"
import { parseForecastDate } from "@/shared/lib/parse-forecast-date"
import { SearchPanel } from "@/widgets/search-panel/SearchPanel"
import { SettingsPanel } from "@/widgets/settings-panel/SettingsPanel"
import { MessageState } from "@/shared/ui/status/MessageState"
import { useTranslation } from "react-i18next"
import { DashboardPageSkeleton } from "./DashboardPageSkeleton"
import { DashboardWidgetGrid } from "./DashboardWidgetGrid"
import { DashboardWidgetControls } from "./DashboardWidgetControls"
import { DashboardWidgetPalette } from "./DashboardWidgetPalette"
import { useDashboardLayoutStore } from "@/features/dashboard-layout/dashboard-layout-store"
import { useEffect } from "react"

function isDashboardLocationPath(pathname: string) {
  return /^\/\d+$/.test(pathname)
}

export function DashboardPage() {
  const { t } = useTranslation()
  const {forecast, meta, isLoading} = useForecastStore()
  const hasLoadedForecast = useForecastStore((state) => state.hasLoadedForecast)
  const user = useAuthStore((state) => state.user)
  const hasLoadedCurrentUser = useAuthStore((state) => state.hasLoadedCurrentUser)
  const isEditingDashboard = useDashboardLayoutStore((state) => state.isEditingDashboard)
  const hasLoadedDashboardLayout = useDashboardLayoutStore((state) => state.hasLoadedDashboardLayout)
  const isLoadingDashboardLayout = useDashboardLayoutStore((state) => state.isLoadingDashboardLayout)
  const discardDraftBlocks = useDashboardLayoutStore((state) => state.discardDraftBlocks)

  useEffect(() => {
    if (!user && isEditingDashboard) {
      discardDraftBlocks()
    }
  }, [discardDraftBlocks, isEditingDashboard, user])

  useEffect(() => {
    return () => {
      if (!isDashboardLocationPath(window.location.pathname)) {
        useDashboardLayoutStore.getState().discardDraftBlocks()
      }
    }
  }, [])

  if (
    isLoading ||
    !hasLoadedCurrentUser ||
    (user && (isLoadingDashboardLayout || !hasLoadedDashboardLayout)) ||
    !hasLoadedForecast
  ) {
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
    <div className="flex min-h-0 min-w-0 flex-col gap-5 pb-24 lg:h-full lg:overflow-hidden lg:pb-0">
      <div className="grid shrink-0 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,29fr)_minmax(0,33fr)_minmax(0,38fr)]">
        <SearchPanel />
        <div className="hidden lg:block" />
        <SettingsPanel user={user} />
      </div>
      {user ? <DashboardWidgetPalette /> : null}
      {meta ? (
        <div
          className={`relative grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-5 overflow-visible lg:grid-cols-[minmax(0,29fr)_minmax(0,33fr)_minmax(0,38fr)] lg:grid-rows-[repeat(2,minmax(0,1fr))] ${
            isEditingDashboard ? "dashboard-edit-frame" : ""
          }`}
        >
          <DashboardWidgetGrid
            currentForecast={currentForecast}
            forecast={forecastItems}
            nextHourlyForecast={nextHourlyForecast}
            meta={meta}
            user={user}
          />
        </div>
      ) : null}
      {user ? <DashboardWidgetControls /> : null}
    </div>
  )
}

import { CurrentForecastPanel } from "@/widgets/current-forecast-panel/CurrentForecastPanel"
import { GraphPanel } from "@/widgets/graph-panel/GraphPanel"
import { MapPanel } from "@/widgets/map-panel/MapPanel"
import { NextHourlysPanel } from "@/widgets/next-hourly-panel/NextHourlyPanel"
import type { DashboardWidgetId } from "@/features/dashboard-layout/dashboard-layout-types"
import type { DashboardWidgetDefinition } from "./dashboard-widget-types"
import { DailyForecastsPanel } from "@/widgets/daily-forecast-panel/DailyForecastPanel"
import { FavoriteLocationsWidgetPanel } from "@/widgets/favorite-locations-panel/FavoriteLocationsPanel"
import { SettingsExtendedPanel } from "@/widgets/settings-panel/SettingsExtendedPanel"

// lista svih potencijalnih widgeta za drag & drop na hommeu
export const dashboardWidgetRegistry = {
  currentForecast: {
    id: "currentForecast",
    title: "Current forecast",
    defaultLayout: { w: 4, h: 6 },
    render: ({ currentForecast, meta }) => (
      <CurrentForecastPanel forecast={currentForecast} meta={meta} />
    ),
  },
  nextHourly: {
    id: "nextHourly",
    title: "Next hourly",
    defaultLayout: { w: 4, h: 6 },
    render: ({ nextHourlyForecast, meta }) => (
      <NextHourlysPanel forecast={nextHourlyForecast} meta={meta} />
    ),
  },
  map: {
    id: "map",
    title: "Map",
    defaultLayout: { w: 4, h: 3 },
    render: () => <MapPanel />,
  },
  graph: {
    id: "graph",
    title: "Forecast graph",
    defaultLayout: { w: 8, h: 3 },
    render: ({ forecast, meta }) => <GraphPanel forecast={forecast} meta={meta} />,
  },
  dailyForecast: {
    id: "dailyForecast",
    title: "Daily Forecast",
    defaultLayout: { w: 4, h: 3 },
    render: () => (
      <DailyForecastsPanel/>
    ),
  },
  favoriteLocations: {
    id: "favoriteLocations",
    title: "Favorite Locations",
    defaultLayout: { w: 4, h: 3 },
    render: () => (
      <FavoriteLocationsWidgetPanel/>
    ),
  },
  settings: {
    id: "settings",
    title: "Settings",
    defaultLayout: { w: 4, h: 3 },
    render: () => (
      <SettingsExtendedPanel/>
    ),
  },
} satisfies Record<DashboardWidgetId, DashboardWidgetDefinition>

export const dashboardWidgets = Object.values(dashboardWidgetRegistry)

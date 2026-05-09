import { CurrentForecastPanel } from "@/widgets/current-forecast-panel/CurrentForecastPanel"
import { GraphPanel } from "@/widgets/graph-panel/GraphPanel"
import { MapPanel } from "@/widgets/map-panel/MapPanel"
import { NextHourlysPanel } from "@/widgets/next-hourly-panel/NextHourlyPanel"
import { ColorPanel } from "./ColorPanel"
import type { DashboardWidgetId } from "@/features/dashboard-layout/dashboard-layout-types"
import type { DashboardWidgetDefinition } from "./dashboard-widget-types"

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
  colorPanelOne: {
    id: "colorPanelOne",
    title: "Color panel 1",
    defaultLayout: { w: 4, h: 3 },
    render: () => (
      <ColorPanel
        label="1"
        className="bg-linear-to-br from-sky-400 to-blue-700"
      />
    ),
  },
  colorPanelTwo: {
    id: "colorPanelTwo",
    title: "Color panel 2",
    defaultLayout: { w: 4, h: 3 },
    render: () => (
      <ColorPanel
        label="2"
        className="bg-linear-to-br from-emerald-400 to-teal-700"
      />
    ),
  },
  colorPanelThree: {
    id: "colorPanelThree",
    title: "Color panel 3",
    defaultLayout: { w: 4, h: 3 },
    render: () => (
      <ColorPanel
        label="3"
        className="bg-linear-to-br from-amber-300 to-orange-700"
      />
    ),
  },
  colorPanelFour: {
    id: "colorPanelFour",
    title: "Color panel 4",
    defaultLayout: { w: 4, h: 3 },
    render: () => (
      <ColorPanel
        label="4"
        className="bg-linear-to-br from-rose-400 to-fuchsia-800"
      />
    ),
  },
} satisfies Record<DashboardWidgetId, DashboardWidgetDefinition>

export const dashboardWidgets = Object.values(dashboardWidgetRegistry)

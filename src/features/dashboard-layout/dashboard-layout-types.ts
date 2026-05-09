export type DashboardWidgetId =
  | "currentForecast"
  | "nextHourly"
  | "map"
  | "graph"
  | "colorPanelOne"
  | "colorPanelTwo"
  | "colorPanelThree"
  | "colorPanelFour"

export type DashboardLayoutItem = {
  i: DashboardWidgetId
  x: number
  y: number
  w: number
  h: number
}

export type DashboardLayoutStore = {
  layout: DashboardLayoutItem[]
  setLayout: (layout: DashboardLayoutItem[]) => void
  addWidget: (widgetId: DashboardWidgetId) => void
  removeWidget: (widgetId: DashboardWidgetId) => void
  resetLayout: () => void
}

import { create } from "zustand"
import type {
  DashboardLayoutItem,
  DashboardLayoutStore,
  DashboardWidgetId,
} from "./dashboard-layout-types"

const DASHBOARD_LAYOUT_STORAGE_KEY = "weather-dashboard-layout"

const DEFAULT_WIDGET_LAYOUTS: Record<
  DashboardWidgetId,
  Omit<DashboardLayoutItem, "i" | "x" | "y">
> = {
  currentForecast: { w: 4, h: 6 },
  nextHourly: { w: 4, h: 6 },
  map: { w: 4, h: 3 },
  graph: { w: 8, h: 3 },
  colorPanelOne: { w: 4, h: 3 },
  colorPanelTwo: { w: 4, h: 3 },
  colorPanelThree: { w: 4, h: 3 },
  colorPanelFour: { w: 4, h: 3 },
}

export const DEFAULT_DASHBOARD_LAYOUT: DashboardLayoutItem[] = [
  { i: "currentForecast", x: 0, y: 0, w: 4, h: 6 },
  { i: "nextHourly", x: 4, y: 0, w: 4, h: 6 },
  { i: "map", x: 8, y: 0, w: 4, h: 3 },
  { i: "graph", x: 8, y: 3, w: 4, h: 3 },
]

//provjera ida
function isDashboardWidgetId(value: string): value is DashboardWidgetId {
  return value in DEFAULT_WIDGET_LAYOUTS
}

// projvera objekta iz local storagra
function isDashboardLayoutItem(value: unknown): value is DashboardLayoutItem {
  if (!value || typeof value !== "object") {
    return false
  }

  const item = value as Partial<DashboardLayoutItem>

  return (
    typeof item.i === "string" &&
    isDashboardWidgetId(item.i) &&
    typeof item.x === "number" &&
    typeof item.y === "number" &&
    typeof item.w === "number" &&
    typeof item.h === "number"
  )
}

function loadLayoutFromStorage() {
  const savedLayout = localStorage.getItem(DASHBOARD_LAYOUT_STORAGE_KEY)

  if (!savedLayout) {
    return DEFAULT_DASHBOARD_LAYOUT
  }

  try {
    const parsedLayout = JSON.parse(savedLayout) as unknown

    if (!Array.isArray(parsedLayout) || !parsedLayout.every(isDashboardLayoutItem)) {
      return DEFAULT_DASHBOARD_LAYOUT
    }

    return parsedLayout
  } catch {
    return DEFAULT_DASHBOARD_LAYOUT
  }
}

function saveLayoutToStorage(layout: DashboardLayoutItem[]) {
  localStorage.setItem(DASHBOARD_LAYOUT_STORAGE_KEY, JSON.stringify(layout))
}

// racuna gdje psotavit widget kojeg doda user
function getNextWidgetPosition(layout: DashboardLayoutItem[]) {
  return layout.reduce((maxY, item) => Math.max(maxY, item.y + item.h), 0)
}

export const useDashboardLayoutStore = create<DashboardLayoutStore>((set, get) => ({
  layout: loadLayoutFromStorage(),
  setLayout: (layout) => {
    saveLayoutToStorage(layout)
    set({ layout })
  },
  addWidget: (widgetId) => {
    const layout = get().layout

    if (layout.some((item) => item.i === widgetId)) {
      return
    }

    const widgetLayout = DEFAULT_WIDGET_LAYOUTS[widgetId]
    const updatedLayout: DashboardLayoutItem[] = [
      ...layout,
      {
        i: widgetId,
        x: 0,
        y: getNextWidgetPosition(layout),
        ...widgetLayout,
      },
    ]

    saveLayoutToStorage(updatedLayout)
    set({ layout: updatedLayout })
  },
  removeWidget: (widgetId) => {
    const updatedLayout = get().layout.filter((item) => item.i !== widgetId)

    saveLayoutToStorage(updatedLayout)
    set({ layout: updatedLayout })
  },
  resetLayout: () => {
    saveLayoutToStorage(DEFAULT_DASHBOARD_LAYOUT)
    set({ layout: DEFAULT_DASHBOARD_LAYOUT })
  },
}))

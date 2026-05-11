import { useDashboardLayoutStore } from "@/features/dashboard-layout/dashboard-layout-store"
import type { DashboardWidgetId } from "@/features/dashboard-layout/dashboard-layout-types"
import type { LucideIcon } from "lucide-react"
import { Activity, Clock, CloudSun, Map, Square } from "lucide-react"
import { dashboardWidgets } from "./dashboard-widget-registry"

const DASHBOARD_DRAG_DATA_TYPE = "application/x-dashboard-widget"

const widgetIcons: Record<DashboardWidgetId, LucideIcon> = {
  currentForecast: CloudSun,
  nextHourly: Clock,
  map: Map,
  graph: Activity,
  dailyForecast: Square,
  favoriteLocations: Square,
  settings: Square,
}

export function DashboardWidgetPalette() {
  const isEditingDashboard = useDashboardLayoutStore((state) => state.isEditingDashboard)
  const draftBlocks = useDashboardLayoutStore((state) => state.draftBlocks)
  const activeWidgetIds = new Set(
    draftBlocks
      .map((block) => block.widgetId)
      .filter((widgetId): widgetId is DashboardWidgetId => widgetId !== null),
  )

  if (!isEditingDashboard) {
    return null
  }

  return (
    <div className="fixed top-6 left-1/2 z-50 hidden -translate-x-1/2 rounded-full border border-white/10 bg-[#20252c]/90 px-3 py-2 shadow-[0_18px_45px_rgba(0,0,0,0.32)] backdrop-blur-xl lg:block">
      <div className="flex items-center gap-2">
        {dashboardWidgets.map((widget) => {
          const Icon = widgetIcons[widget.id]
          const isActive = activeWidgetIds.has(widget.id)

          return (
            <button
              key={widget.id}
              type="button"
              draggable
              onDragStart={(event) => {
                event.dataTransfer.effectAllowed = "copyMove"
                event.dataTransfer.setData(
                  DASHBOARD_DRAG_DATA_TYPE,
                  JSON.stringify({ type: "widget", widgetId: widget.id }),
                )
                event.dataTransfer.setData("text/plain", widget.id)
              }}
              className={`group flex h-[62px] w-[82px] cursor-grab flex-col items-center justify-center gap-1 rounded-full border border-white/10 bg-white/[0.045] px-2 text-center transition hover:-translate-y-0.5 hover:border-accent-primary/45 hover:bg-white/[0.075] active:cursor-grabbing ${
                isActive ? "opacity-55" : "opacity-100"
              }`}
              title={isActive ? "Already used. Drag to move it." : "Drag into a dashboard box."}
            >
              <Icon
                size={17}
                className="text-accent-primary transition group-hover:text-accent-secondary"
              />
              <span className="line-clamp-2 text-[9px] font-medium leading-tight text-white/75">
                {widget.title}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

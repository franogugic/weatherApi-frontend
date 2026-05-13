import { useDashboardLayoutStore } from "@/features/dashboard-layout/dashboard-layout-store"
import type { DashboardWidgetId } from "@/features/dashboard-layout/dashboard-layout-types"
import type { LucideIcon } from "lucide-react"
import { Activity, CalendarDays, Clock, CloudSun, Heart, Map, SlidersHorizontal } from "lucide-react"
import { useTranslation } from "react-i18next"
import { dashboardWidgets } from "./dashboard-widget-registry"

const DASHBOARD_DRAG_DATA_TYPE = "application/x-dashboard-widget"

const widgetIcons: Record<DashboardWidgetId, LucideIcon> = {
  currentForecast: CloudSun,
  nextHourly: Clock,
  map: Map,
  graph: Activity,
  dailyForecast: CalendarDays,
  favoriteLocations: Heart,
  settings: SlidersHorizontal,
}

export function DashboardWidgetPalette() {
  const { t } = useTranslation()
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
    <div className="fixed top-6 left-1/2 z-[10000] hidden -translate-x-1/2 rounded-3xl border border-white/10 bg-[#1F2026]/95 p-2 shadow-[0_18px_45px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-2xl lg:block">
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
              className={`group flex h-[64px] w-[92px] cursor-grab flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-center transition hover:-translate-y-0.5 active:cursor-grabbing ${
                isActive
                  ? "bg-linear-to-br from-accent-secondary/22 to-accent-primary/18 text-white opacity-60"
                  : "text-white/62 hover:bg-white/7 hover:text-white"
              }`}
              title={isActive ? t("dashboard.widgetAlreadyUsed") : t("dashboard.widgetDragHint")}
            >
              <Icon
                size={18}
                className={`transition ${
                  isActive ? "text-white" : "text-accent-primary group-hover:text-accent-secondary"
                }`}
              />
              <span className="line-clamp-2 text-[10px] font-semibold leading-tight">
                {t(`dashboard.widgets.${widget.id}`)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

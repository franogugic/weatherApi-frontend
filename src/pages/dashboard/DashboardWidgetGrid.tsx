import {
  getClaimedDashboardCellIds,
  useDashboardLayoutStore,
} from "@/features/dashboard-layout/dashboard-layout-store"
import type { DashboardCellId } from "@/features/dashboard-layout/dashboard-layout-types"
import { dashboardWidgetRegistry } from "./dashboard-widget-registry"
import type { DashboardWidgetRenderProps } from "./dashboard-widget-types"
import type { CSSProperties } from "react"

type DashboardWidgetGridProps = DashboardWidgetRenderProps

const cellPosition: Record<DashboardCellId, { column: number; row: number }> = {
  A: { column: 1, row: 1 },
  B: { column: 2, row: 1 },
  C: { column: 3, row: 1 },
  D: { column: 1, row: 2 },
  E: { column: 2, row: 2 },
  F: { column: 3, row: 2 },
}

function EmptyDashboardBlock() {
  return (
    <div className="flex h-full min-h-[180px] items-center justify-center rounded-4xl border border-dashed border-white/10 bg-white/[0.03] text-sm text-subtext">
      Empty block
    </div>
  )
}

function getBlockGridStyle(cellIds: DashboardCellId[]): CSSProperties {
  const positions = cellIds.map((cellId) => cellPosition[cellId])
  const columnStart = Math.min(...positions.map((position) => position.column))
  const columnEnd = Math.max(...positions.map((position) => position.column))
  const rowStart = Math.min(...positions.map((position) => position.row))
  const rowEnd = Math.max(...positions.map((position) => position.row))

  return {
    gridColumn: `${columnStart} / span ${columnEnd - columnStart + 1}`,
    gridRow: `${rowStart} / span ${rowEnd - rowStart + 1}`,
  }
}

export function DashboardWidgetGrid(props: DashboardWidgetGridProps) {
  const blocks = useDashboardLayoutStore((state) =>
    state.isEditingDashboard ? state.draftBlocks : state.blocks,
  )
  const claimedCellIds = getClaimedDashboardCellIds(blocks)

  return (
    <>
      {blocks.map((block) => {
        const startCellId = block.cellIds[0]

        if (startCellId && claimedCellIds.has(startCellId)) {
          return null
        }

        const renderedWidget = block.widgetId
          ? dashboardWidgetRegistry[block.widgetId].render(props)
          : <EmptyDashboardBlock />

        return (
          <div
            key={block.id}
            className={`h-full min-h-0 min-w-0 overflow-hidden [&>*]:h-full ${
              block.widgetId === "map" ? "hidden lg:block" : ""
            }`}
            style={getBlockGridStyle(block.cellIds)}
          >
            {renderedWidget}
          </div>
        )
      })}
    </>
  )
}

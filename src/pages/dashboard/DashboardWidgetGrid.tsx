import {
  getClaimedDashboardCellIds,
  useDashboardLayoutStore,
} from "@/features/dashboard-layout/dashboard-layout-store"
import type { DashboardCellId } from "@/features/dashboard-layout/dashboard-layout-types"
import type {
  DashboardBlockId,
  DashboardWidgetId,
} from "@/features/dashboard-layout/dashboard-layout-types"
import { dashboardWidgetRegistry } from "./dashboard-widget-registry"
import type { DashboardWidgetRenderProps } from "./dashboard-widget-types"
import type { CSSProperties, DragEvent } from "react"
import { useState } from "react"
import { Trash2 } from "lucide-react"

type DashboardWidgetGridProps = DashboardWidgetRenderProps

type DashboardDragPayload =
  | {
      type: "block"
      blockId: DashboardBlockId
    }
  | {
      type: "widget"
      widgetId: DashboardWidgetId
    }

const DASHBOARD_DRAG_DATA_TYPE = "application/x-dashboard-widget"

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

function parseDashboardDragPayload(event: DragEvent<HTMLDivElement>) {
  try {
    const payload = event.dataTransfer.getData(DASHBOARD_DRAG_DATA_TYPE)

    return payload ? (JSON.parse(payload) as DashboardDragPayload) : null
  } catch {
    return null
  }
}

export function DashboardWidgetGrid(props: DashboardWidgetGridProps) {
  const blocks = useDashboardLayoutStore((state) =>
    state.isEditingDashboard ? state.draftBlocks : state.blocks,
  )
  const isEditingDashboard = useDashboardLayoutStore((state) => state.isEditingDashboard)
  const setDraftBlockWidget = useDashboardLayoutStore((state) => state.setDraftBlockWidget)
  const moveDraftBlockWidget = useDashboardLayoutStore((state) => state.moveDraftBlockWidget)
  const [draggedBlockId, setDraggedBlockId] = useState<DashboardBlockId | null>(null)
  const [dropTargetBlockId, setDropTargetBlockId] = useState<DashboardBlockId | null>(null)
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
            draggable={isEditingDashboard && block.widgetId !== null}
            onDragStart={(event) => {
              if (!isEditingDashboard || block.widgetId === null) {
                event.preventDefault()
                return
              }

              event.dataTransfer.effectAllowed = "move"
              event.dataTransfer.setData(
                DASHBOARD_DRAG_DATA_TYPE,
                JSON.stringify({ type: "block", blockId: block.id }),
              )
              event.dataTransfer.setData("text/plain", block.id)
              setDraggedBlockId(block.id)
            }}
            onDragOver={(event) => {
              if (!isEditingDashboard || draggedBlockId === block.id) {
                return
              }

              event.preventDefault()
              event.dataTransfer.dropEffect = "move"
              setDropTargetBlockId(block.id)
            }}
            onDragLeave={() => {
              if (dropTargetBlockId === block.id) {
                setDropTargetBlockId(null)
              }
            }}
            onDragEnd={() => {
              setDraggedBlockId(null)
              setDropTargetBlockId(null)
            }}
            onDrop={(event) => {
              event.preventDefault()

              const payload = parseDashboardDragPayload(event)

              if (payload?.type === "widget") {
                setDraftBlockWidget(block.id, payload.widgetId)
              }

              if (payload?.type === "block") {
                moveDraftBlockWidget(payload.blockId, block.id)
              }

              setDraggedBlockId(null)
              setDropTargetBlockId(null)
            }}
            className={`group relative h-full min-h-0 min-w-0 overflow-hidden transition ${
              block.widgetId === "map" ? "hidden lg:block" : ""
            } ${isEditingDashboard ? "dashboard-edit-frame cursor-grab active:cursor-grabbing" : ""} ${
              draggedBlockId === block.id ? "scale-[0.985] opacity-55" : ""
            } ${
              dropTargetBlockId === block.id
                ? "rounded-4xl ring-2 ring-accent-primary/80 ring-offset-2 ring-offset-[#111820]"
                : ""
            }`}
            style={getBlockGridStyle(block.cellIds)}
          >
            {isEditingDashboard && block.widgetId !== null && (
              <button
                type="button"
                onMouseDown={(event) => {
                  event.stopPropagation()
                }}
                onClick={(event) => {
                  event.stopPropagation()
                  setDraftBlockWidget(block.id, null)
                }}
                className="absolute top-3 right-3 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-red-500/90 text-white shadow-[0_10px_24px_rgba(0,0,0,0.32)] backdrop-blur-md transition hover:scale-105 hover:bg-red-400"
                aria-label="Remove widget from dashboard block"
              >
                <Trash2 size={15} />
              </button>
            )}
            <div className="h-full">{renderedWidget}</div>
          </div>
        )
      })}
    </>
  )
}

import {
  DASHBOARD_CELL_NEIGHBORS,
  DASHBOARD_CELL_ORDER,
  getClaimedDashboardCellIds,
  useDashboardLayoutStore,
} from "@/features/dashboard-layout/dashboard-layout-store"
import type { DashboardCellId } from "@/features/dashboard-layout/dashboard-layout-types"
import type {
  DashboardBlockId,
  DashboardWidgetId,
} from "@/features/dashboard-layout/dashboard-layout-types"
import { dashboardWidgetRegistry } from "./dashboard-widget-registry"
import { setDashboardDragPreview } from "./dashboard-drag-preview"
import type { DashboardWidgetRenderProps } from "./dashboard-widget-types"
import type { CSSProperties, DragEvent } from "react"
import { useState } from "react"
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Trash2 } from "lucide-react"
import type { LucideIcon } from "lucide-react"

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
  | {
      type: "expand"
      blockId: DashboardBlockId
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

type ExpandDirection = "up" | "right" | "down" | "left"

type ExpansionOption = {
  blockId: DashboardBlockId
  direction: ExpandDirection
  Icon: LucideIcon
  className: string
  label: string
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

function isVerticalDashboardBlock(cellIds: DashboardCellId[]) {
  if (cellIds.length !== 2) {
    return false
  }

  const positions = cellIds.map((cellId) => cellPosition[cellId])

  return positions[0]?.column === positions[1]?.column
}

function parseDashboardDragPayload(event: DragEvent<HTMLDivElement>) {
  try {
    const payload = event.dataTransfer.getData(DASHBOARD_DRAG_DATA_TYPE)

    return payload ? (JSON.parse(payload) as DashboardDragPayload) : null
  } catch {
    return null
  }
}

function getExpandDirection(sourceCellId: DashboardCellId, targetCellId: DashboardCellId) {
  const sourceIndex = DASHBOARD_CELL_ORDER.indexOf(sourceCellId)
  const targetIndex = DASHBOARD_CELL_ORDER.indexOf(targetCellId)
  const offset = targetIndex - sourceIndex

  if (offset === -3) {
    return "up"
  }

  if (offset === 3) {
    return "down"
  }

  if (offset === -1) {
    return "left"
  }

  return "right"
}

const expandHandleConfig: Record<
  ExpandDirection,
  {
    Icon: LucideIcon
    className: string
    label: string
  }
> = {
  up: {
    Icon: ArrowUp,
    className: "top-3 left-1/2 -translate-x-1/2",
    label: "Expand up",
  },
  right: {
    Icon: ArrowRight,
    className: "top-1/2 right-3 -translate-y-1/2",
    label: "Expand right",
  },
  down: {
    Icon: ArrowDown,
    className: "bottom-3 left-1/2 -translate-x-1/2",
    label: "Expand down",
  },
  left: {
    Icon: ArrowLeft,
    className: "top-1/2 left-3 -translate-y-1/2",
    label: "Expand left",
  },
}

function getExpansionOptions(
  blockId: DashboardBlockId,
  sourceCellId: DashboardCellId,
  blocks: ReturnType<typeof useDashboardLayoutStore.getState>["draftBlocks"],
  claimedCellIds: Set<DashboardCellId>,
) {
  return blocks
    .filter((block) => block.widgetId === null && block.cellIds.length === 1)
    .filter((block) => {
      const targetCellId = block.cellIds[0]

      return targetCellId && !claimedCellIds.has(targetCellId)
    })
    .filter((block) => {
      const targetCellId = block.cellIds[0]

      return targetCellId ? DASHBOARD_CELL_NEIGHBORS[sourceCellId].includes(targetCellId) : false
    })
    .map((block): ExpansionOption | null => {
      const targetCellId = block.cellIds[0]

      if (!targetCellId) {
        return null
      }

      const direction = getExpandDirection(sourceCellId, targetCellId)
      const config = expandHandleConfig[direction]

      return {
        blockId: block.id,
        direction,
        Icon: config.Icon,
        className: config.className,
        label: config.label,
      }
    })
    .filter((option): option is ExpansionOption => option !== null && option.blockId !== blockId)
}

export function DashboardWidgetGrid(props: DashboardWidgetGridProps) {
  const blocks = useDashboardLayoutStore((state) =>
    state.isEditingDashboard ? state.draftBlocks : state.blocks,
  )
  const isEditingDashboard = useDashboardLayoutStore((state) => state.isEditingDashboard)
  const setDraftBlockWidget = useDashboardLayoutStore((state) => state.setDraftBlockWidget)
  const moveDraftBlockWidget = useDashboardLayoutStore((state) => state.moveDraftBlockWidget)
  const expandDraftBlockToEmptyBlock = useDashboardLayoutStore(
    (state) => state.expandDraftBlockToEmptyBlock,
  )
  const [draggedBlockId, setDraggedBlockId] = useState<DashboardBlockId | null>(null)
  const [dropTargetBlockId, setDropTargetBlockId] = useState<DashboardBlockId | null>(null)
  const claimedCellIds = getClaimedDashboardCellIds(blocks)

  function startBlockDrag(
    event: DragEvent<HTMLDivElement>,
    blockId: DashboardBlockId,
    previewElement?: HTMLElement,
  ) {
    event.dataTransfer.effectAllowed = "move"
    event.dataTransfer.setData(
      DASHBOARD_DRAG_DATA_TYPE,
      JSON.stringify({ type: "block", blockId }),
    )
    event.dataTransfer.setData("text/plain", "")

    if (previewElement) {
      setDashboardDragPreview(event, previewElement)
    }

    setDraggedBlockId(blockId)
  }

  return (
    <>
      {blocks.map((block) => {
        const startCellId = block.cellIds[0]

        if (startCellId && claimedCellIds.has(startCellId)) {
          return null
        }

        const renderedWidget = block.widgetId
          ? dashboardWidgetRegistry[block.widgetId].render({
              ...props,
              blockCellCount: block.cellIds.length,
              blockCellIds: block.cellIds,
              isVerticalBlock: isVerticalDashboardBlock(block.cellIds),
            })
          : <EmptyDashboardBlock />
        const expansionOptions =
          isEditingDashboard && block.widgetId !== null && block.cellIds.length === 1 && startCellId
            ? getExpansionOptions(block.id, startCellId, blocks, claimedCellIds)
            : []

        return (
          <div
            key={block.id}
            draggable={isEditingDashboard && block.widgetId !== null}
            onDragStart={(event) => {
              if (!isEditingDashboard || block.widgetId === null) {
                event.preventDefault()
                return
              }

              startBlockDrag(event, block.id, event.currentTarget)
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

              if (payload?.type === "expand") {
                expandDraftBlockToEmptyBlock(payload.blockId, block.id)
              }

              setDraggedBlockId(null)
              setDropTargetBlockId(null)
            }}
            className={`group relative h-full min-h-0 min-w-0 transition ${
              block.widgetId === "map" ? "hidden lg:block" : ""
            } ${block.widgetId === "graph" ? "overflow-visible" : "overflow-hidden"} ${
              isEditingDashboard ? "dashboard-edit-frame cursor-grab active:cursor-grabbing" : ""
            } ${
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
            {expansionOptions.map((option) => {
              const Icon = option.Icon

              return (
                <button
                  key={`${block.id}-${option.blockId}-${option.direction}`}
                  type="button"
                  draggable
                  onDragStart={(event) => {
                    event.stopPropagation()
                    event.dataTransfer.effectAllowed = "move"
                    event.dataTransfer.setData(
                      DASHBOARD_DRAG_DATA_TYPE,
                      JSON.stringify({ type: "expand", blockId: block.id }),
                    )
                    event.dataTransfer.setData("text/plain", "")
                    setDraggedBlockId(block.id)
                  }}
                  onClick={(event) => {
                    event.stopPropagation()
                  }}
                  className={`absolute z-30 flex h-8 w-8 cursor-grab items-center justify-center rounded-full border border-accent-primary/35 bg-[#20252c]/90 text-accent-secondary shadow-[0_10px_24px_rgba(0,0,0,0.32)] backdrop-blur-md transition hover:scale-105 hover:border-accent-secondary/70 hover:text-white active:cursor-grabbing ${option.className}`}
                  aria-label={option.label}
                  title={`${option.label}: drag into the empty block`}
                >
                  <Icon size={15} />
                </button>
              )
            })}
            {isEditingDashboard && block.widgetId !== null && (
              <div
                draggable
                onDragStart={(event) => {
                  const previewElement = event.currentTarget.parentElement

                  if (previewElement) {
                    startBlockDrag(event, block.id, previewElement)
                    return
                  }

                  startBlockDrag(event, block.id)
                }}
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                }}
                onMouseDown={(event) => {
                  event.stopPropagation()
                }}
                className="absolute inset-0 z-20 cursor-grab active:cursor-grabbing"
                aria-hidden="true"
              />
            )}
            <div className="h-full">{renderedWidget}</div>
          </div>
        )
      })}
    </>
  )
}

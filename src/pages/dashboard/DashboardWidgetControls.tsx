import {
  DASHBOARD_CELL_NEIGHBORS,
  DASHBOARD_CELL_ORDER,
  getClaimedDashboardCellIds,
  useDashboardLayoutStore,
} from "@/features/dashboard-layout/dashboard-layout-store"
import type {
  DashboardBlock,
  DashboardBlockSize,
  DashboardCellId,
  DashboardWidgetId,
} from "@/features/dashboard-layout/dashboard-layout-types"
import { Eye, EyeOff, RotateCcw } from "lucide-react"
import { useState } from "react"
import { dashboardWidgets } from "./dashboard-widget-registry"

function getBlockSize(block: DashboardBlock): DashboardBlockSize {
  if (block.cellIds.length === 1) {
    return "single"
  }

  const [firstCell, secondCell] = block.cellIds

  if (!firstCell || !secondCell) {
    return "single"
  }

  const firstIndex = DASHBOARD_CELL_ORDER.indexOf(firstCell)
  const secondIndex = DASHBOARD_CELL_ORDER.indexOf(secondCell)

  return Math.abs(firstIndex - secondIndex) === 3 ? "vertical" : "horizontal"
}

function getCandidateCellsForSize(
  startCellId: DashboardCellId,
  size: DashboardBlockSize,
): DashboardCellId[][] {
  if (size === "single") {
    return [[startCellId]]
  }

  const startIndex = DASHBOARD_CELL_ORDER.indexOf(startCellId)

  return DASHBOARD_CELL_NEIGHBORS[startCellId]
    .filter((cellId) => {
      const neighborIndex = DASHBOARD_CELL_ORDER.indexOf(cellId)

      return size === "vertical"
        ? Math.abs(startIndex - neighborIndex) === 3
        : Math.abs(startIndex - neighborIndex) === 1
    })
    .map((cellId) => [startCellId, cellId])
}

function getMergeDirectionLabel(startCellId: DashboardCellId, targetCellId: DashboardCellId) {
  const startIndex = DASHBOARD_CELL_ORDER.indexOf(startCellId)
  const targetIndex = DASHBOARD_CELL_ORDER.indexOf(targetCellId)
  const offset = targetIndex - startIndex

  if (offset === -1) {
    return "left"
  }

  if (offset === 1) {
    return "right"
  }

  if (offset === -3) {
    return "up"
  }

  return "down"
}

function hasCellConflict(
  blocks: DashboardBlock[],
  currentBlockId: string,
  nextCellIds: DashboardCellId[],
) {
  const claimedCellIds = getClaimedDashboardCellIds(blocks)
  const usedCells = new Set(
    blocks
      .filter((block) => block.id !== currentBlockId)
      .filter((block) => block.widgetId !== null)
      .filter((block) => {
        const startCellId = block.cellIds[0]
        return !startCellId || !claimedCellIds.has(startCellId)
      })
      .flatMap((block) => block.cellIds),
  )

  return nextCellIds.some((cellId) => usedCells.has(cellId))
}

function getCellsForSize(
  blocks: DashboardBlock[],
  currentBlockId: string,
  startCellId: DashboardCellId,
  size: DashboardBlockSize,
) {
  const candidates = getCandidateCellsForSize(startCellId, size)

  return (
    candidates.find((cellIds) => !hasCellConflict(blocks, currentBlockId, cellIds)) ?? [
      startCellId,
    ]
  )
}

function canUseSize(
  blocks: DashboardBlock[],
  currentBlockId: string,
  startCellId: DashboardCellId,
  size: DashboardBlockSize,
) {
  return getCandidateCellsForSize(startCellId, size).some(
    (cellIds) => !hasCellConflict(blocks, currentBlockId, cellIds),
  )
}

function getAvailableMergeOptions(
  blocks: DashboardBlock[],
  currentBlockId: string,
  startCellId: DashboardCellId,
  size: DashboardBlockSize,
) {
  return getCandidateCellsForSize(startCellId, size)
    .filter((cellIds) => !hasCellConflict(blocks, currentBlockId, cellIds))
    .map((cellIds) => {
      const targetCellId = cellIds[1]

      return {
        cellIds,
        targetCellId,
        label: targetCellId
          ? `${targetCellId} (${getMergeDirectionLabel(startCellId, targetCellId)})`
          : startCellId,
      }
    })
    .filter(
      (option): option is {
        cellIds: DashboardCellId[]
        targetCellId: DashboardCellId
        label: string
      } => option.targetCellId !== undefined,
    )
}

export function DashboardWidgetControls() {
  const [isVisible, setIsVisible] = useState(true)
  const blocks = useDashboardLayoutStore((state) => state.blocks)
  const setBlockWidget = useDashboardLayoutStore((state) => state.setBlockWidget)
  const setBlockCells = useDashboardLayoutStore((state) => state.setBlockCells)
  const resetBlocks = useDashboardLayoutStore((state) => state.resetBlocks)
  const claimedCellIds = getClaimedDashboardCellIds(blocks)
  const activeWidgetIds = new Set(
    blocks
      .filter((block) => {
        const startCellId = block.cellIds[0]
        return !startCellId || !claimedCellIds.has(startCellId)
      })
      .map((block) => block.widgetId)
      .filter((widgetId): widgetId is DashboardWidgetId => widgetId !== null),
  )

  if (!isVisible) {
    return (
      <button
        type="button"
        onClick={() => setIsVisible(true)}
        className="fixed right-6 bottom-6 z-40 rounded-full border border-white/10 bg-[#20252c]/90 p-3 text-white/75 shadow-[0_14px_32px_rgba(0,0,0,0.32)] backdrop-blur-xl transition hover:text-white"
        aria-label="Show dashboard customization panel"
      >
        <Eye size={20} />
      </button>
    )
  }

  return (
    <div className="fixed right-6 bottom-6 z-40 w-[330px] rounded-4xl border border-white/10 bg-[#20252c]/90 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[15px] font-semibold text-white">Customize home</p>
          <p className="text-[12px] font-light text-subtext">
            Move widgets across six cells and let them span two cells.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="rounded-full bg-white/7 p-2 text-white/70 transition hover:bg-white/12 hover:text-white"
            aria-label="Hide dashboard customization panel"
          >
            <EyeOff size={15} />
          </button>
          <button
            type="button"
            onClick={resetBlocks}
            className="rounded-full bg-white/7 p-2 text-white/70 transition hover:bg-white/12 hover:text-white"
            aria-label="Reset dashboard widgets"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      <div className="max-h-[62vh] space-y-3 overflow-y-auto pr-1">
        {blocks.map((block) => {
          const currentSize = getBlockSize(block)
          const startCellId = block.cellIds[0] ?? "A"
          const isClaimed = claimedCellIds.has(startCellId)
          const mergeOptions =
            currentSize === "single"
              ? []
              : getAvailableMergeOptions(blocks, block.id, startCellId, currentSize)

          return (
            <div
              key={block.id}
              className={`rounded-2xl px-3 py-2 ${
                isClaimed ? "bg-white/[0.025] opacity-50" : "bg-white/5"
              }`}
            >
              <p className="mb-2 text-[12px] font-light text-subtext">
                {block.title}
                {isClaimed ? " (used by merged block)" : ""}
              </p>

              <label
                htmlFor={`dashboard-block-widget-${block.id}`}
                className="mb-2 block text-[11px] font-light text-subtext"
              >
                Widget
                <select
                  id={`dashboard-block-widget-${block.id}`}
                  value={block.widgetId ?? ""}
                  disabled={isClaimed}
                  onChange={(event) => {
                    const value = event.target.value
                    setBlockWidget(
                      block.id,
                      value ? (value as DashboardWidgetId) : null,
                    )
                  }}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#181d23] px-3 py-2 text-[13px] font-medium text-white outline-none transition focus:border-accent-primary/60 disabled:cursor-not-allowed"
                >
                  <option value="">Empty</option>
                  {dashboardWidgets.map((widget) => (
                    <option
                      key={widget.id}
                      value={widget.id}
                      disabled={activeWidgetIds.has(widget.id) && widget.id !== block.widgetId}
                    >
                      {widget.title}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <label
                  htmlFor={`dashboard-block-cell-${block.id}`}
                  className="text-[11px] font-light text-subtext"
                >
                  Start
                  <select
                    id={`dashboard-block-cell-${block.id}`}
                    value={startCellId}
                    disabled={isClaimed}
                    onChange={(event) => {
                      const nextCellIds = getCellsForSize(
                        blocks,
                        block.id,
                        event.target.value as DashboardCellId,
                        currentSize,
                      )

                      setBlockCells(block.id, nextCellIds)
                    }}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#181d23] px-3 py-2 text-[13px] font-medium text-white outline-none transition focus:border-accent-primary/60 disabled:cursor-not-allowed"
                  >
                    {DASHBOARD_CELL_ORDER.map((cellId) => {
                      const isDisabled = !canUseSize(blocks, block.id, cellId, currentSize)

                      return (
                        <option key={cellId} value={cellId} disabled={isDisabled}>
                          {cellId}
                        </option>
                      )
                    })}
                  </select>
                </label>

                <label
                  htmlFor={`dashboard-block-size-${block.id}`}
                  className="text-[11px] font-light text-subtext"
                >
                  Size
                  <select
                    id={`dashboard-block-size-${block.id}`}
                    value={currentSize}
                    disabled={isClaimed}
                    onChange={(event) => {
                      const nextCellIds = getCellsForSize(
                        blocks,
                        block.id,
                        startCellId,
                        event.target.value as DashboardBlockSize,
                      )

                      setBlockCells(block.id, nextCellIds)
                    }}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#181d23] px-3 py-2 text-[13px] font-medium text-white outline-none transition focus:border-accent-primary/60 disabled:cursor-not-allowed"
                  >
                    <option value="single">1 box</option>
                    <option
                      value="horizontal"
                      disabled={!canUseSize(
                        blocks,
                        block.id,
                        startCellId,
                        "horizontal",
                      )}
                    >
                      2 horizontal
                    </option>
                    <option
                      value="vertical"
                      disabled={!canUseSize(
                        blocks,
                        block.id,
                        startCellId,
                        "vertical",
                      )}
                    >
                      2 vertical
                    </option>
                  </select>
                </label>
              </div>

              {currentSize !== "single" && (
                <label
                  htmlFor={`dashboard-block-merge-target-${block.id}`}
                  className="mt-2 block text-[11px] font-light text-subtext"
                >
                  Merge with
                  <select
                    id={`dashboard-block-merge-target-${block.id}`}
                    value={block.cellIds[1] ?? ""}
                    disabled={isClaimed || mergeOptions.length === 0}
                    onChange={(event) => {
                      const selectedOption = mergeOptions.find(
                        (option) => option.targetCellId === event.target.value,
                      )

                      if (selectedOption) {
                        setBlockCells(block.id, selectedOption.cellIds)
                      }
                    }}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#181d23] px-3 py-2 text-[13px] font-medium text-white outline-none transition focus:border-accent-primary/60 disabled:cursor-not-allowed"
                  >
                    {mergeOptions.map((option) => (
                      <option key={option.targetCellId} value={option.targetCellId}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

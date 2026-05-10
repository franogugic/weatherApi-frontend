import { create } from "zustand"
import type {
  DashboardBlock,
  DashboardBlockId,
  DashboardCellId,
  DashboardLayoutStore,
  DashboardWidgetId,
} from "./dashboard-layout-types"

const DASHBOARD_LAYOUT_STORAGE_KEY = "weather-dashboard-six-box-layout-v2"

const DASHBOARD_WIDGET_IDS: Record<DashboardWidgetId, true> = {
  currentForecast: true,
  nextHourly: true,
  map: true,
  graph: true,
  colorPanelOne: true,
  colorPanelTwo: true,
  colorPanelThree: true,
  colorPanelFour: true,
}

export const DASHBOARD_CELL_ORDER: DashboardCellId[] = ["A", "B", "C", "D", "E", "F"]

export const DASHBOARD_CELL_NEIGHBORS: Record<DashboardCellId, DashboardCellId[]> = {
  A: ["B", "D"],
  B: ["A", "C", "E"],
  C: ["B", "F"],
  D: ["A", "E"],
  E: ["D", "F", "B"],
  F: ["E", "C"],
}

export const DEFAULT_DASHBOARD_BLOCKS: DashboardBlock[] = [
  { id: "cellA", title: "Cell A", widgetId: "nextHourly", cellIds: ["A", "D"] },
  { id: "cellB", title: "Cell B", widgetId: "currentForecast", cellIds: ["B"] },
  { id: "cellC", title: "Cell C", widgetId: "map", cellIds: ["C"] },
  { id: "cellD", title: "Cell D", widgetId: null, cellIds: ["D"] },
  { id: "cellE", title: "Cell E", widgetId: "graph", cellIds: ["E", "F"] },
  { id: "cellF", title: "Cell F", widgetId: null, cellIds: ["F"] },
]

function cloneBlocks(blocks: DashboardBlock[]) {
  return blocks.map((block) => ({
    ...block,
    cellIds: [...block.cellIds],
  }))
}

function areBlocksEqual(firstBlocks: DashboardBlock[], secondBlocks: DashboardBlock[]) {
  return JSON.stringify(firstBlocks) === JSON.stringify(secondBlocks)
}

function isDashboardWidgetId(value: string): value is DashboardWidgetId {
  return value in DASHBOARD_WIDGET_IDS
}

function isDashboardCellId(value: string): value is DashboardCellId {
  return DASHBOARD_CELL_ORDER.includes(value as DashboardCellId)
}

function isDashboardBlockId(value: string): value is DashboardBlockId {
  return DEFAULT_DASHBOARD_BLOCKS.some((block) => block.id === value)
}

export function areCellsConnected(cellIds: DashboardCellId[]) {
  if (cellIds.length === 1) {
    return true
  }

  if (cellIds.length !== 2) {
    return false
  }

  const [firstCell, secondCell] = cellIds

  return Boolean(firstCell && secondCell && DASHBOARD_CELL_NEIGHBORS[firstCell].includes(secondCell))
}

export function getClaimedDashboardCellIds(blocks: DashboardBlock[]) {
  const blockStartCells = new Set(
    blocks
      .map((block) => block.cellIds[0])
      .filter((cellId): cellId is DashboardCellId => cellId !== undefined),
  )
  const claimedCells = new Set<DashboardCellId>()

  blocks
    .filter((block) => block.widgetId !== null)
    .forEach((block) => {
      block.cellIds.slice(1).forEach((cellId) => {
        if (blockStartCells.has(cellId)) {
          claimedCells.add(cellId)
        }
      })
    })

  return claimedCells
}

function hasCellConflicts(blocks: DashboardBlock[]) {
  const usedCells = new Set<DashboardCellId>()
  const claimedCells = getClaimedDashboardCellIds(blocks)

  return blocks.some((block) => {
    const blockStartCell = block.cellIds[0]

    if (blockStartCell && claimedCells.has(blockStartCell)) {
      return false
    }

    if (block.widgetId === null) {
      return false
    }

    return block.cellIds.some((cellId) => {
      if (usedCells.has(cellId)) {
        return true
      }

      usedCells.add(cellId)
      return false
    })
  })
}

function isDashboardBlock(value: unknown): value is DashboardBlock {
  if (!value || typeof value !== "object") {
    return false
  }

  const block = value as Partial<DashboardBlock>

  return (
    typeof block.id === "string" &&
    isDashboardBlockId(block.id) &&
    typeof block.title === "string" &&
    (block.widgetId === null ||
      (typeof block.widgetId === "string" && isDashboardWidgetId(block.widgetId))) &&
    Array.isArray(block.cellIds) &&
    block.cellIds.every((cellId) => typeof cellId === "string" && isDashboardCellId(cellId)) &&
    areCellsConnected(block.cellIds)
  )
}

function mergeWithDefaultBlocks(savedBlocks: DashboardBlock[]) {
  return DEFAULT_DASHBOARD_BLOCKS.map((defaultBlock) => {
    const savedBlock = savedBlocks.find((block) => block.id === defaultBlock.id)

    return savedBlock
      ? {
          ...defaultBlock,
          widgetId: savedBlock.widgetId,
          cellIds: savedBlock.cellIds,
        }
      : defaultBlock
  })
}

function loadBlocksFromStorage() {
  const savedBlocks = localStorage.getItem(DASHBOARD_LAYOUT_STORAGE_KEY)

  if (!savedBlocks) {
    return DEFAULT_DASHBOARD_BLOCKS
  }

  try {
    const parsedBlocks = JSON.parse(savedBlocks) as unknown

    if (!Array.isArray(parsedBlocks) || !parsedBlocks.every(isDashboardBlock)) {
      return DEFAULT_DASHBOARD_BLOCKS
    }

    const blocks = mergeWithDefaultBlocks(parsedBlocks)

    return hasCellConflicts(blocks) ? DEFAULT_DASHBOARD_BLOCKS : blocks
  } catch {
    return DEFAULT_DASHBOARD_BLOCKS
  }
}

function saveBlocksToStorage(blocks: DashboardBlock[]) {
  localStorage.setItem(DASHBOARD_LAYOUT_STORAGE_KEY, JSON.stringify(blocks))
}

const initialDashboardBlocks = loadBlocksFromStorage()

export const useDashboardLayoutStore = create<DashboardLayoutStore>((set, get) => ({
  blocks: initialDashboardBlocks,
  draftBlocks: cloneBlocks(initialDashboardBlocks),
  isEditingDashboard: false,
  hasUnsavedChanges: false,
  startDashboardEditing: () => {
    const blocks = get().blocks

    set({
      draftBlocks: cloneBlocks(blocks),
      isEditingDashboard: true,
      hasUnsavedChanges: false,
    })
  },
  setDraftBlockWidget: (blockId, widgetId) => {
    const updatedDraftBlocks = get().draftBlocks.map((block) => ({
      ...block,
      widgetId:
        block.id === blockId
          ? widgetId
          : block.widgetId === widgetId && widgetId !== null
            ? null
            : block.widgetId,
    }))

    set({
      draftBlocks: updatedDraftBlocks,
      hasUnsavedChanges: !areBlocksEqual(get().blocks, updatedDraftBlocks),
    })
  },
  setDraftBlockCells: (blockId, cellIds) => {
    if (!areCellsConnected(cellIds)) {
      return
    }

    const updatedDraftBlocks = get().draftBlocks.map((block) => ({
      ...block,
      cellIds: block.id === blockId ? cellIds : block.cellIds,
    }))

    if (hasCellConflicts(updatedDraftBlocks)) {
      return
    }

    set({
      draftBlocks: updatedDraftBlocks,
      hasUnsavedChanges: !areBlocksEqual(get().blocks, updatedDraftBlocks),
    })
  },
  moveDraftBlockWidget: (sourceBlockId, targetBlockId) => {
    if (sourceBlockId === targetBlockId) {
      return
    }

    const draftBlocks = get().draftBlocks
    const sourceBlock = draftBlocks.find((block) => block.id === sourceBlockId)
    const targetBlock = draftBlocks.find((block) => block.id === targetBlockId)

    if (!sourceBlock || !targetBlock || sourceBlock.widgetId === null) {
      return
    }

    const updatedDraftBlocks = draftBlocks.map((block) => {
      if (block.id === sourceBlockId) {
        return {
          ...block,
          widgetId: targetBlock.widgetId,
        }
      }

      if (block.id === targetBlockId) {
        return {
          ...block,
          widgetId: sourceBlock.widgetId,
        }
      }

      return block
    })

    set({
      draftBlocks: updatedDraftBlocks,
      hasUnsavedChanges: !areBlocksEqual(get().blocks, updatedDraftBlocks),
    })
  },
  saveDraftBlocks: () => {
    const draftBlocks = get().draftBlocks

    if (hasCellConflicts(draftBlocks)) {
      return
    }

    const savedBlocks = cloneBlocks(draftBlocks)

    saveBlocksToStorage(savedBlocks)
    set({
      blocks: savedBlocks,
      draftBlocks: cloneBlocks(savedBlocks),
      isEditingDashboard: false,
      hasUnsavedChanges: false,
    })
  },
  discardDraftBlocks: () => {
    const blocks = get().blocks

    set({
      draftBlocks: cloneBlocks(blocks),
      isEditingDashboard: false,
      hasUnsavedChanges: false,
    })
  },
  resetDraftBlocks: () => {
    const defaultBlocks = cloneBlocks(DEFAULT_DASHBOARD_BLOCKS)

    set({
      draftBlocks: defaultBlocks,
      hasUnsavedChanges: !areBlocksEqual(get().blocks, defaultBlocks),
    })
  },
}))

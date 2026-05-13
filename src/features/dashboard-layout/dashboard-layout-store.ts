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
  dailyForecast: true,
  favoriteLocations: true,
  settings: true,
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

function getSingleCellIds(block: DashboardBlock) {
  return block.cellIds[0] ? [block.cellIds[0]] : block.cellIds
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

function hasEmptyVisibleBlocks(blocks: DashboardBlock[]) {
  const claimedCellIds = getClaimedDashboardCellIds(blocks)

  return blocks.some((block) => {
    const startCellId = block.cellIds[0]

    return block.widgetId === null && (!startCellId || !claimedCellIds.has(startCellId))
  })
}

function getDraftState(blocks: DashboardBlock[], draftBlocks: DashboardBlock[]) {
  return {
    draftBlocks,
    hasUnsavedChanges: !areBlocksEqual(blocks, draftBlocks),
    hasEmptyVisibleBlocks: hasEmptyVisibleBlocks(draftBlocks),
  }
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
  hasEmptyVisibleBlocks: hasEmptyVisibleBlocks(initialDashboardBlocks),
  startDashboardEditing: () => {
    const blocks = get().blocks

    set({
      draftBlocks: cloneBlocks(blocks),
      isEditingDashboard: true,
      hasUnsavedChanges: false,
      hasEmptyVisibleBlocks: hasEmptyVisibleBlocks(blocks),
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
    })).map((block) => ({
      ...block,
      cellIds: block.widgetId === null ? getSingleCellIds(block) : block.cellIds,
    }))

    set(getDraftState(get().blocks, updatedDraftBlocks))
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

    set(getDraftState(get().blocks, updatedDraftBlocks))
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
        const nextWidgetId = targetBlock.widgetId

        return {
          ...block,
          widgetId: nextWidgetId,
          cellIds: nextWidgetId === null ? getSingleCellIds(block) : block.cellIds,
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

    set(getDraftState(get().blocks, updatedDraftBlocks))
  },
  expandDraftBlockToEmptyBlock: (sourceBlockId, targetBlockId) => {
    const draftBlocks = get().draftBlocks
    const sourceBlock = draftBlocks.find((block) => block.id === sourceBlockId)
    const targetBlock = draftBlocks.find((block) => block.id === targetBlockId)
    const sourceCellId = sourceBlock?.cellIds[0]
    const targetCellId = targetBlock?.cellIds[0]

    if (
      !sourceBlock ||
      !targetBlock ||
      !sourceCellId ||
      !targetCellId ||
      sourceBlock.widgetId === null ||
      targetBlock.widgetId !== null ||
      sourceBlock.cellIds.length !== 1 ||
      targetBlock.cellIds.length !== 1 ||
      !DASHBOARD_CELL_NEIGHBORS[sourceCellId].includes(targetCellId)
    ) {
      return
    }

    const updatedDraftBlocks = draftBlocks.map((block) => ({
      ...block,
      cellIds: block.id === sourceBlockId ? [sourceCellId, targetCellId] : block.cellIds,
    }))

    if (hasCellConflicts(updatedDraftBlocks)) {
      return
    }

    set(getDraftState(get().blocks, updatedDraftBlocks))
  },
  saveDraftBlocks: () => {
    const draftBlocks = get().draftBlocks

    if (hasCellConflicts(draftBlocks) || hasEmptyVisibleBlocks(draftBlocks)) {
      return
    }

    const savedBlocks = cloneBlocks(draftBlocks)

    saveBlocksToStorage(savedBlocks)
    set({
      blocks: savedBlocks,
      draftBlocks: cloneBlocks(savedBlocks),
      isEditingDashboard: false,
      hasUnsavedChanges: false,
      hasEmptyVisibleBlocks: false,
    })
  },
  discardDraftBlocks: () => {
    const blocks = get().blocks

    set({
      draftBlocks: cloneBlocks(blocks),
      isEditingDashboard: false,
      hasUnsavedChanges: false,
      hasEmptyVisibleBlocks: hasEmptyVisibleBlocks(blocks),
    })
  },
  resetDraftBlocks: () => {
    const defaultBlocks = cloneBlocks(DEFAULT_DASHBOARD_BLOCKS)

    set(getDraftState(get().blocks, defaultBlocks))
  },
  resetDashboardLayout: () => {
    const defaultBlocks = cloneBlocks(DEFAULT_DASHBOARD_BLOCKS)

    set({
      blocks: defaultBlocks,
      draftBlocks: cloneBlocks(defaultBlocks),
      isEditingDashboard: false,
      hasUnsavedChanges: false,
      hasEmptyVisibleBlocks: hasEmptyVisibleBlocks(defaultBlocks),
    })
  },
}))

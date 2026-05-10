export type DashboardWidgetId =
  | "currentForecast"
  | "nextHourly"
  | "map"
  | "graph"
  | "colorPanelOne"
  | "colorPanelTwo"
  | "colorPanelThree"
  | "colorPanelFour"

export type DashboardCellId = "A" | "B" | "C" | "D" | "E" | "F"

export type DashboardBlockId =
  | "cellA"
  | "cellB"
  | "cellC"
  | "cellD"
  | "cellE"
  | "cellF"

export type DashboardBlock = {
  id: DashboardBlockId
  title: string
  widgetId: DashboardWidgetId | null
  cellIds: DashboardCellId[]
}

export type DashboardBlockSize = "single" | "horizontal" | "vertical"

export type DashboardLayoutStore = {
  blocks: DashboardBlock[]
  draftBlocks: DashboardBlock[]
  isEditingDashboard: boolean
  hasUnsavedChanges: boolean
  startDashboardEditing: () => void
  setDraftBlockWidget: (blockId: DashboardBlockId, widgetId: DashboardWidgetId | null) => void
  setDraftBlockCells: (blockId: DashboardBlockId, cellIds: DashboardCellId[]) => void
  moveDraftBlockWidget: (sourceBlockId: DashboardBlockId, targetBlockId: DashboardBlockId) => void
  saveDraftBlocks: () => void
  discardDraftBlocks: () => void
  resetDraftBlocks: () => void
}

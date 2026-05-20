import {
  DEFAULT_DASHBOARD_BLOCKS,
  getClaimedDashboardCellIds,
} from "@/features/dashboard-layout/dashboard-layout-store"
import type {
  DashboardCellId,
  DashboardWidgetId,
} from "@/features/dashboard-layout/dashboard-layout-types"
import { Skeleton } from "@/shared/ui/skeleton/Skeleton"
import type { CSSProperties } from "react"

const cellPosition: Record<DashboardCellId, { column: number; row: number }> = {
  A: { column: 1, row: 1 },
  B: { column: 2, row: 1 },
  C: { column: 3, row: 1 },
  D: { column: 1, row: 2 },
  E: { column: 2, row: 2 },
  F: { column: 3, row: 2 },
}

function getSkeletonGridStyle(
  cellIds: DashboardCellId[],
): CSSProperties & Record<string, string> {
  const positions = cellIds.map((cellId) => cellPosition[cellId])
  const columnStart = Math.min(...positions.map((position) => position.column))
  const columnEnd = Math.max(...positions.map((position) => position.column))
  const rowStart = Math.min(...positions.map((position) => position.row))
  const rowEnd = Math.max(...positions.map((position) => position.row))

  return {
    "--dashboard-grid-column": `${columnStart} / span ${columnEnd - columnStart + 1}`,
    "--dashboard-grid-row": `${rowStart} / span ${rowEnd - rowStart + 1}`,
  }
}

function CurrentForecastSkeleton() {
  return (
    <div className="flex h-full min-h-[280px] min-w-0 flex-col justify-between overflow-hidden rounded-4xl bg-linear-to-b from-accent-secondary/70 to-accent-primary/70 px-4 py-4 sm:px-5 lg:min-h-0 lg:px-6 lg:py-5">
      <div>
        <Skeleton className="mb-2 h-4 w-32 bg-white/20" />
        <Skeleton className="h-5 w-44 max-w-full bg-white/20" />
      </div>
      <div className="flex flex-col items-center justify-center">
        <Skeleton className="mb-4 h-16 w-36 max-w-full bg-white/20" />
        <Skeleton className="h-28 w-28 rounded-full bg-white/20" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full bg-white/20" />
            <Skeleton className="h-3 w-12 bg-white/20" />
            <Skeleton className="h-2.5 w-10 bg-white/20" />
          </div>
        ))}
      </div>
    </div>
  )
}

function NextHourlySkeleton() {
  return (
    <div className="flex h-full min-h-[280px] min-w-0 flex-col rounded-4xl bg-div p-4 sm:p-6 lg:min-h-0">
      <div className="mb-4 flex items-center justify-between gap-4">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="mb-2 grid grid-cols-3 px-2">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="mx-auto h-3 w-16" />
        <Skeleton className="ml-auto h-3 w-12" />
      </div>
      <div className="grid flex-1" style={{ gridTemplateRows: "repeat(8, minmax(0, 1fr))" }}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="grid grid-cols-3 items-center px-2">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="mx-auto h-10 w-10 rounded-full" />
            <Skeleton className="ml-auto h-4 w-16" />
          </div>
        ))}
      </div>
      <Skeleton className="mt-4 h-10 w-full rounded-4xl bg-linear-to-r from-accent-secondary/40 to-accent-primary/40" />
    </div>
  )
}

function MapSkeleton() {
  return (
    <div className="relative h-full min-h-[280px] overflow-hidden rounded-4xl bg-[#49484d] lg:min-h-0">
      <Skeleton className="absolute left-[8%] top-[18%] h-3 w-[42%] rotate-[-10deg] rounded-full bg-white/8" />
      <Skeleton className="absolute right-[10%] top-[34%] h-3 w-[36%] rotate-[14deg] rounded-full bg-white/8" />
      <Skeleton className="absolute bottom-[24%] left-[20%] h-3 w-[52%] rotate-[6deg] rounded-full bg-white/8" />
      <Skeleton className="absolute bottom-[38%] right-[18%] h-20 w-36 rounded-full bg-[#313236]/70" />
      <Skeleton className="absolute left-[10%] top-[42%] h-24 w-48 rounded-full bg-[#313236]/70" />
      <div className="absolute left-1/2 top-1/2 flex min-w-[172px] -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-2xl border border-white/15 bg-white/8 px-3 py-1.5 text-center shadow-lg backdrop-blur-xl">
        <div className="flex items-center gap-1">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="mt-1 h-3 w-28" />
      </div>
    </div>
  )
}

function GraphSkeleton() {
  return (
    <div className="flex h-full min-h-[280px] min-w-0 flex-col overflow-hidden rounded-4xl bg-div p-4 sm:p-6 lg:min-h-0">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Skeleton className="h-7 w-36" />
        <div className="flex gap-2 rounded-full bg-white/6 p-1">
          <Skeleton className="h-8 w-20 rounded-full bg-white/15" />
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-16 rounded-full" />
        </div>
      </div>
      <div className="relative min-h-44 flex-1 rounded-2xl">
        <Skeleton className="absolute bottom-0 left-0 h-[70%] w-full" />
        <Skeleton className="absolute bottom-[28%] left-[7%] h-1 w-[86%] rotate-[-6deg] rounded-full bg-accent-secondary/30" />
        <div className="absolute inset-x-4 bottom-4 flex justify-between">
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton key={index} className="h-3 w-8 sm:w-10" />
          ))}
        </div>
      </div>
    </div>
  )
}

function WidgetSkeleton({ widgetId }: { widgetId: DashboardWidgetId | null }) {
  if (widgetId === "nextHourly") {
    return <NextHourlySkeleton />
  }

  if (widgetId === "currentForecast") {
    return <CurrentForecastSkeleton />
  }

  if (widgetId === "map") {
    return <MapSkeleton />
  }

  if (widgetId === "graph") {
    return <GraphSkeleton />
  }

  return null
}

export function DashboardPageSkeleton() {
  const claimedCellIds = getClaimedDashboardCellIds(DEFAULT_DASHBOARD_BLOCKS)
  const visibleBlocks = DEFAULT_DASHBOARD_BLOCKS.filter((block) => {
    const startCellId = block.cellIds[0]

    return block.widgetId !== null && (!startCellId || !claimedCellIds.has(startCellId))
  })

  return (
    <div className="flex min-h-0 min-w-0 flex-col gap-5 pb-24 lg:h-full lg:overflow-hidden lg:pb-0">
      <div className="grid shrink-0 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,29fr)_minmax(0,33fr)_minmax(0,38fr)]">
        <div className="rounded-4xl border border-white/10 bg-[#1F2026]/97 px-6 py-5 shadow-[0_8px_22px_rgba(0,0,0,0.22)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Skeleton className="h-[22px] w-[22px] shrink-0 rounded-full" />
            <Skeleton className="h-5 min-w-0 flex-1" />
          </div>
        </div>
        <div className="hidden lg:block" />
        <div className="flex justify-end">
          <div className="flex items-center gap-3">
            <Skeleton className="hidden h-5 w-36 sm:block" />
            <Skeleton className="h-12 w-12 rounded-full bg-linear-to-br from-accent-secondary/70 to-accent-primary/70" />
          </div>
        </div>
      </div>

      <div className="relative grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-5 overflow-visible lg:grid-cols-[minmax(0,29fr)_minmax(0,33fr)_minmax(0,38fr)] lg:grid-rows-[repeat(2,minmax(0,1fr))]">
        {visibleBlocks.map((block) => (
          <div
            key={block.id}
            className="relative min-h-[280px] min-w-0 lg:h-full lg:min-h-0 lg:[grid-column:var(--dashboard-grid-column)] lg:[grid-row:var(--dashboard-grid-row)]"
            style={getSkeletonGridStyle(block.cellIds)}
          >
            <WidgetSkeleton widgetId={block.widgetId} />
          </div>
        ))}
      </div>
    </div>
  )
}

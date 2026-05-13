import { Skeleton } from "@/shared/ui/skeleton/Skeleton"

function WidgetShellSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`min-h-0 min-w-0 rounded-4xl bg-div p-6 ${className}`}>
      <Skeleton className="mb-4 h-6 w-36" />
      <div className="flex h-[calc(100%-2.5rem)] min-h-0 flex-col justify-between gap-4">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-3 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function DashboardPageSkeleton() {
  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col gap-5 overflow-hidden">
      <div className="grid shrink-0 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,29fr)_minmax(0,33fr)_minmax(0,38fr)]">
        <div className="rounded-4xl border border-white/10 bg-[#1F2026]/97 px-6 py-5 shadow-[0_8px_22px_rgba(0,0,0,0.22)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Skeleton className="h-[22px] w-[22px] rounded-full" />
            <Skeleton className="h-5 min-w-0 flex-1" />
          </div>
        </div>
        <div className="hidden lg:block" />
        <div className="flex justify-end">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-12 w-12 rounded-full bg-linear-to-br from-accent-secondary/70 to-accent-primary/70" />
          </div>
        </div>
      </div>

      <div className="relative grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-5 overflow-hidden lg:grid-cols-[minmax(0,29fr)_minmax(0,33fr)_minmax(0,38fr)] lg:grid-rows-[repeat(2,minmax(0,1fr))]">
        <div className="row-span-2 flex min-h-0 min-w-0 flex-col rounded-4xl bg-div p-6">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="mb-2 flex justify-between px-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
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
        </div>

        <div className="flex min-h-0 min-w-0 flex-col justify-between overflow-hidden rounded-4xl bg-linear-to-b from-accent-secondary/70 to-accent-primary/70 px-6 py-5">
          <div>
            <Skeleton className="mb-2 h-4 w-28 bg-white/20" />
            <Skeleton className="h-5 w-44 bg-white/20" />
          </div>
          <div className="flex flex-col items-center justify-center">
            <Skeleton className="mb-3 h-14 w-32 bg-white/20" />
            <Skeleton className="h-28 w-28 rounded-full bg-white/20" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-full bg-white/20" />
            ))}
          </div>
        </div>

        <div className="relative hidden overflow-hidden rounded-4xl bg-[#49484d] lg:block">
          <Skeleton className="absolute left-1/2 top-1/2 h-16 w-44 -translate-x-1/2 -translate-y-1/2 border border-white/15 bg-white/10 backdrop-blur-xl" />
          <Skeleton className="absolute left-[18%] top-[25%] h-3 w-28 bg-white/10" />
          <Skeleton className="absolute bottom-[22%] right-[14%] h-3 w-36 bg-white/10" />
        </div>

        <WidgetShellSkeleton />
        <div className="col-span-1 min-h-0 rounded-4xl bg-div p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-7 w-36" />
            <div className="flex gap-2 rounded-full bg-white/6 p-1">
              <Skeleton className="h-8 w-20 rounded-full bg-white/15" />
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-full" />
            </div>
          </div>
          <div className="relative h-[calc(100%-3rem)] min-h-44 rounded-2xl">
            <Skeleton className="absolute bottom-0 left-0 h-[70%] w-full" />
            <Skeleton className="absolute bottom-[28%] left-[7%] h-1 w-[86%] rotate-[-6deg] rounded-full bg-accent-secondary/30" />
            <div className="absolute inset-x-4 bottom-4 flex justify-between">
              {Array.from({ length: 7 }).map((_, index) => (
                <Skeleton key={index} className="h-3 w-10" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

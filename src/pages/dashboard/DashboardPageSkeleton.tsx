import { Skeleton } from "@/shared/ui/skeleton/Skeleton"

export function DashboardPageSkeleton() {
  return (
    <div className="grid min-h-full min-w-0 grid-cols-1 gap-5 lg:h-full lg:grid-cols-[minmax(0,29fr)_minmax(0,33fr)_minmax(0,38fr)] lg:grid-rows-[auto_minmax(0,1fr)_minmax(0,1fr)]">
      <div className="bg-div relative h-fit min-w-0 self-start rounded-4xl px-6 py-5">
        <div className="flex items-center gap-2">
          <Skeleton className="h-[22px] w-[22px] rounded-full" />
          <Skeleton className="h-5 min-w-0 flex-1" />
        </div>
      </div>

      <div className="lg:row-span-2 flex min-w-0 flex-col justify-between rounded-4xl bg-linear-to-b from-accent-secondary/70 to-accent-primary/70 p-6">
        <div className="text-[14px]">
          <Skeleton className="mb-2 h-4 w-36 bg-white/20" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full bg-white/20" />
            <Skeleton className="h-5 w-48 bg-white/20" />
          </div>
        </div>

        <div className="mx-auto flex w-full flex-col items-center justify-center py-8 text-center">
          <div className="mb-2 flex translate-y-2 items-end justify-center gap-2">
            <Skeleton className="h-16 w-28 bg-white/20 2xl:h-20" />
            <Skeleton className="h-9 w-14 bg-white/20" />
          </div>
          <Skeleton className="h-40 w-40 rounded-full bg-white/20 2xl:h-46 2xl:w-46" />
        </div>

        <div className="mx-auto flex w-full flex-wrap gap-y-4 lg:flex-nowrap">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className={`flex flex-1 items-center justify-center gap-3 px-3 ${
                index < 2 ? "border-r border-white/30" : ""
              }`}
            >
              <Skeleton className="h-8 w-8 rounded-full bg-white/20" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-12 bg-white/20" />
                <Skeleton className="h-3 w-16 bg-white/20" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative ml-auto h-fit w-fit self-start">
        <Skeleton className="h-10 w-32 rounded-2xl bg-linear-to-b from-accent-secondary/70 to-accent-primary/70" />
      </div>

      <div className="lg:row-span-2 flex min-h-0 min-w-0 flex-col rounded-4xl bg-div p-6">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="mb-2 flex items-center justify-between px-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="grid flex-1" style={{ gridTemplateRows: "repeat(8, minmax(0, 1fr))" }}>
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="grid h-full grid-cols-3 items-center px-2">
              <Skeleton className="h-4 w-10" />
              <Skeleton className="mx-auto h-10 w-10 rounded-full" />
              <Skeleton className="ml-auto h-4 w-16" />
            </div>
          ))}
        </div>
        <Skeleton className="mt-4 h-11 w-full rounded-4xl bg-linear-to-b from-accent-secondary/60 to-accent-primary/60" />
      </div>

      <div className="relative hidden overflow-hidden rounded-4xl bg-[#49484d] lg:block">
        <Skeleton className="absolute left-1/2 top-1/2 h-16 w-44 -translate-x-1/2 -translate-y-1/2 border border-white/15 bg-white/10 backdrop-blur-xl" />
        <Skeleton className="absolute left-[32%] top-[34%] h-3 w-28 bg-white/10" />
        <Skeleton className="absolute bottom-[28%] right-[22%] h-3 w-36 bg-white/10" />
      </div>

      <div className="lg:col-span-2 flex min-h-[360px] min-w-0 flex-col rounded-4xl bg-div p-6">
        <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-4">
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <Skeleton className="h-8 w-32" />
            <div className="flex gap-2 rounded-full bg-white/6 p-1">
              <Skeleton className="h-8 w-24 rounded-full bg-white/15" />
              <Skeleton className="h-8 w-28 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          </div>
        </div>
        <div className="relative min-h-0 flex-1 rounded-2xl">
          <Skeleton className="absolute bottom-0 left-0 h-[70%] w-full" />
          <Skeleton className="absolute bottom-[18%] left-[8%] h-1 w-[84%] rotate-[-7deg] rounded-full bg-accent-secondary/30" />
          <div className="absolute inset-x-4 bottom-4 flex justify-between">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-3 w-12" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

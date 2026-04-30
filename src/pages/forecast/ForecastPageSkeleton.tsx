import { Skeleton } from "@/shared/ui/skeleton/Skeleton"

export function ForecastPageSkeleton() {
  return (
    <div className="flex h-full min-w-0 flex-1 flex-col overflow-y-auto rounded-4xl bg-div p-6">
      <Skeleton className="mb-8 h-10 w-72 max-w-full" />

      <div className="mb-8 grid w-full grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex min-h-[320px] flex-col gap-4 rounded-[22px] border border-white/10 bg-[#2b2f36]/70 p-[18px] shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.03)]"
          >
            <div className="flex items-center justify-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-28" />
            </div>

            <div className="flex flex-1 items-center justify-center gap-6">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-3">
                <Skeleton className="h-[46px] w-32" />
                <div className="flex items-center justify-center gap-3">
                  <Skeleton className="h-4 w-14 bg-[#ff6b6b]/30" />
                  <Skeleton className="h-4 w-1" />
                  <Skeleton className="h-4 w-14 bg-[#4da3ff]/30" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 border-t border-white/10 text-sm">
              {Array.from({ length: 6 }).map((__, metricIndex) => (
                <div
                  key={metricIndex}
                  className={`flex items-center gap-3 py-3 ${
                    metricIndex < 4 ? "border-b border-white/10" : ""
                  } ${metricIndex % 2 === 1 ? "pl-4" : ""}`}
                >
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-3.5 w-16" />
                    <Skeleton className="h-2.5 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl py-4">
        <div className="overflow-x-auto">
        <div className="min-w-[860px]">
          <div className="mb-4 grid grid-cols-[110px_80px_1fr_1fr_1fr_1fr_1fr_1fr] px-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-3 w-16" />
            ))}
          </div>
          <div className="space-y-3">
            {Array.from({ length: 9 }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid grid-cols-[110px_80px_1fr_1fr_1fr_1fr_1fr_1fr] items-center border-b border-white/10 px-3 py-2"
              >
                {Array.from({ length: 8 }).map((__, cellIndex) => (
                  <Skeleton key={cellIndex} className="h-4 w-16" />
                ))}
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

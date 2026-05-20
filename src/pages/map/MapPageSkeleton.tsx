import { Skeleton } from "@/shared/ui/skeleton/Skeleton"

export function MapPageSkeleton() {
  return (
    <div className="flex min-h-0 flex-col lg:h-full">
      <Skeleton className="mb-4 h-8 w-32" />
      <div className="flex min-h-0 flex-1 flex-col gap-4 xl:flex-row">
        <div className="relative min-h-[360px] overflow-hidden rounded-4xl bg-[#49484d] sm:min-h-[460px] xl:min-h-0 xl:flex-1">
          <div className="absolute inset-0 opacity-70">
            <Skeleton className="absolute left-[8%] top-[18%] h-3 w-[42%] rotate-[-10deg] rounded-full bg-white/8" />
            <Skeleton className="absolute right-[10%] top-[34%] h-3 w-[36%] rotate-[14deg] rounded-full bg-white/8" />
            <Skeleton className="absolute bottom-[24%] left-[20%] h-3 w-[52%] rotate-[6deg] rounded-full bg-white/8" />
            <Skeleton className="absolute bottom-[38%] right-[18%] h-20 w-36 rounded-full bg-[#313236]/70" />
            <Skeleton className="absolute left-[10%] top-[42%] h-24 w-48 rounded-full bg-[#313236]/70" />
          </div>
          {[
            "left-[22%] top-[24%]",
            "right-[24%] top-[36%]",
            "left-[44%] bottom-[26%]",
          ].map((positionClass, index) => (
            <div
              key={index}
              className={`absolute ${positionClass} flex min-w-[172px] max-w-[260px] -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-2xl border border-white/15 bg-white/8 px-3 py-1.5 text-center shadow-lg backdrop-blur-xl`}
            >
              <div className="flex items-center gap-1">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="mt-1 h-3 w-28" />
            </div>
          ))}
        </div>

        <div className="flex min-h-0 flex-col rounded-4xl bg-div p-4 sm:p-6 xl:h-full xl:w-[320px] xl:shrink-0">
          <Skeleton className="mx-auto mb-6 h-8 w-48" />
          <div className="min-h-0 flex-1 space-y-0 overflow-hidden">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="border-y border-white/20 p-4">
                <Skeleton className="mb-4 h-5 w-44" />
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-36" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

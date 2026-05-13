import { Skeleton } from "@/shared/ui/skeleton/Skeleton"

export function SettingsPageSkeleton() {
  return (
    <main className="flex h-full min-h-0 flex-col overflow-hidden rounded-4xl bg-div p-6 text-white">
      <div className="mb-4 flex h-10 items-center justify-between">
        <Skeleton className="h-7 w-32" />
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2 lg:grid-rows-[100px_150px_minmax(0,1fr)_150px_60px]">
        <div className="col-span-2 flex items-center justify-between rounded-4xl bg-[#2b2f36]/70 p-6">
          <div className="space-y-3">
            <Skeleton className="h-9 w-72" />
            <Skeleton className="h-3 w-96 max-w-full" />
          </div>
          <Skeleton className="h-11 w-32 rounded-full" />
        </div>

        <div className="rounded-4xl bg-[#2b2f36]/70 p-4">
          <Skeleton className="mb-6 h-6 w-44" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-52" />
            </div>
          </div>
        </div>

        <div className="row-span-2 rounded-4xl bg-[#2b2f36]/70 p-4">
          <Skeleton className="mb-6 h-6 w-24" />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="border-b border-white/10 p-2">
                <Skeleton className="mb-3 h-4 w-24" />
                <Skeleton className="h-9 w-full rounded-2xl" />
              </div>
            ))}
          </div>
        </div>

        <div className="row-span-2 rounded-4xl bg-[#2b2f36]/70 p-4">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-9 w-36 rounded-2xl" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-[22px]" />
            ))}
          </div>
        </div>

        <div className="rounded-4xl bg-[#2b2f36]/70 p-4">
          <Skeleton className="mb-3 h-6 w-28" />
          <Skeleton className="h-10 w-full rounded-2xl" />
        </div>
      </div>
    </main>
  )
}

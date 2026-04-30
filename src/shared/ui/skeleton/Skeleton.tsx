type SkeletonProps = {
  className?: string
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${className}`.trim()}
    />
  )
}

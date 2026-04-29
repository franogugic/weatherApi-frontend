type LoadingStateProps = {
  message: string
  className?: string
}

export function LoadingState({ message, className = "" }: LoadingStateProps) {
  return (
    <div className={`flex h-full min-h-[220px] w-full items-center justify-center ${className}`.trim()}>
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-2 border-white/15" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-accent-secondary border-r-accent-primary" />
        </div>
        <div className="flex items-center gap-2 text-white/70">
          <span>{message}</span>
          <div className="flex gap-1">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-secondary [animation-delay:0ms]" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-primary [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-secondary [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    </div>
  )
}

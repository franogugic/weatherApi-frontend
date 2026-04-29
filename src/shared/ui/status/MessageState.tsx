type MessageStateProps = {
  message: string
  className?: string
}

export function MessageState({ message, className = "" }: MessageStateProps) {
  return (
    <div className={`flex h-full min-h-[220px] w-full items-center justify-center ${className}`.trim()}>
      <p className="max-w-[420px] text-center text-lg font-medium text-white/75">
        {message}
      </p>
    </div>
  )
}

type ColorPanelProps = {
  label: string
  className: string
}

export function ColorPanel({ label, className }: ColorPanelProps) {
  return (
    <div
      className={`flex min-h-[180px] items-center justify-center rounded-4xl p-6 text-6xl font-bold text-white shadow-[0_18px_40px_rgba(0,0,0,0.22)] ${className}`}
    >
      {label}
    </div>
  )
}

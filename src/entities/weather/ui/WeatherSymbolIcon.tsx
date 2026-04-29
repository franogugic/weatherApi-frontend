import { getWeatherSymbolInfo } from "@/entities/weather/model/weather-symbols"

type WeatherSymbolIconProps = {
  symbol: string
  className?: string
  wrapperClassName?: string
}

export function WeatherSymbolIcon({
  symbol,
  className = "",
  wrapperClassName = "",
}: WeatherSymbolIconProps) {
  const weatherInfo = getWeatherSymbolInfo(symbol)

  return (
    <div
      className={`group relative inline-flex items-center justify-center ${wrapperClassName}`.trim()}
      tabIndex={0}
    >
      <img
        src={`/${symbol}.svg`}
        alt={weatherInfo.label}
        className={className}
      />
      <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-max max-w-[220px] -translate-x-1/2 rounded-2xl border border-white/15 bg-white/8 px-3 py-2 text-center text-xs leading-tight text-white opacity-0 shadow-lg backdrop-blur-xl transition-opacity duration-75 group-hover:opacity-100 group-focus-visible:opacity-100">
        {weatherInfo.description}
      </div>
    </div>
  )
}

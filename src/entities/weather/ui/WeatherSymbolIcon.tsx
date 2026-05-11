import { getWeatherSymbolInfo } from "@/entities/weather/model/weather-symbols"
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation()
  const weatherInfo = getWeatherSymbolInfo(symbol)
  const label = t(`weatherSymbols.kind.${weatherInfo.kind}`)
  const descriptionParts = [
    weatherInfo.intensity ? t(`weatherSymbols.intensity.${weatherInfo.intensity}`) : "",
    t(`weatherSymbols.kind.${weatherInfo.kind}`),
    weatherInfo.isShowers ? t("weatherSymbols.showers") : "",
    weatherInfo.hasThunder ? t("weatherSymbols.withThunder") : "",
  ]
    .filter(Boolean)
    .join(" ")
  const description = weatherInfo.timeOfDay
    ? t("weatherSymbols.withTimeOfDay", {
        description: descriptionParts,
        timeOfDay: t(`weatherSymbols.timeOfDay.${weatherInfo.timeOfDay}`),
      })
    : descriptionParts

  return (
    <div
      className={`group/weather-symbol relative inline-flex items-center justify-center ${wrapperClassName}`.trim()}
      tabIndex={0}
    >
      <img
        src={`/${symbol}.svg`}
        alt={label}
        className={className}
      />
      <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-max max-w-[220px] -translate-x-1/2 rounded-2xl border border-white/10 bg-[#20252c]/95 px-3 py-2 text-center text-xs leading-tight text-white opacity-0 shadow-lg backdrop-blur-xl transition-opacity duration-75 group-hover/weather-symbol:opacity-100 group-focus-visible/weather-symbol:opacity-100">
        {description}
      </div>
    </div>
  )
}

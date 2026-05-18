import { getWeatherSymbolInfo } from "@/entities/weather/model/weather-symbols"
import { useRef, useState, type CSSProperties } from "react"
import { useTranslation } from "react-i18next"
import { createPortal } from "react-dom"

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
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const [tooltipStyle, setTooltipStyle] = useState<CSSProperties>({})
  const weatherInfo = getWeatherSymbolInfo(symbol)
  const iconSrc = `${import.meta.env.BASE_URL}${symbol}.svg`
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

  function showTooltip() {
    const wrapperElement = wrapperRef.current

    if (!wrapperElement) {
      return
    }

    const rect = wrapperElement.getBoundingClientRect()

    setTooltipStyle({
      left: rect.left + rect.width / 2,
      top: rect.top - 8,
      transform: "translate(-50%, -100%)",
    })
    setIsTooltipVisible(true)
  }

  function hideTooltip() {
    setIsTooltipVisible(false)
  }

  return (
    <div
      ref={wrapperRef}
      className={`inline-flex items-center justify-center ${wrapperClassName}`.trim()}
      tabIndex={0}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      <img
        src={iconSrc}
        alt={label}
        className={className}
      />
      {isTooltipVisible
        ? createPortal(
            <div
              style={tooltipStyle}
              className="pointer-events-none fixed z-[10000] w-max max-w-[220px] rounded-2xl border border-white/10 bg-[#20252c]/98 px-3 py-2 text-center text-xs leading-tight text-white shadow-[0_14px_30px_rgba(0,0,0,0.38)] backdrop-blur-xl"
            >
              {description}
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}

import { useMemo, useState } from "react"
import type { WeatherForecastItem, WeatherMeta } from "@/entities/weather/model/types"
import { parseForecastDate } from "@/shared/lib/parse-forecast-date"
import {
  CategoryScale,
  Chart as ChartJS,
  type ScriptableContext,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
)

type GraphPanelProps = {
  forecast: WeatherForecastItem[]
  meta: WeatherMeta
}

type GraphMetric = "temperature" | "precipitation" | "wind"

const metricConfig = {
  temperature: {
    label: "Temperature",
    metaKey: "air_temperature",
    fallbackUnit: "°",
    minValue: undefined,
    startColor: "#4974ef",
    endColor: "#6fbcff",
    getValue: (item: WeatherForecastItem) => item.airTemperature,
  },
  precipitation: {
    label: "Precipitation",
    metaKey: "precipitation_amount",
    fallbackUnit: "mm",
    minValue: 0,
    startColor: "#7c3aed",
    endColor: "#c084fc",
    getValue: (item: WeatherForecastItem) => item.precipitationAmount,
  },
  wind: {
    label: "Wind",
    metaKey: "wind_speed",
    fallbackUnit: "m/s",
    minValue: 0,
    startColor: "#15803d",
    endColor: "#4ade80",
    getValue: (item: WeatherForecastItem) => item.windSpeed,
  },
} satisfies Record<
  GraphMetric,
  {
    label: string
    metaKey: string
    fallbackUnit: string
    minValue?: number
    startColor: string
    endColor: string
    getValue: (item: WeatherForecastItem) => number
  }
>

// Uzima podatke za danas + odabrani broj buducih dana.
function getChartItems(forecast: WeatherForecastItem[]) {
  const now = new Date()
  const endDate = new Date(now)
  endDate.setDate(endDate.getDate() + 2)
  endDate.setHours(23, 59, 59, 999)

  return forecast.filter((item) => {
    const forecastDate = parseForecastDate(item.forecastTime)
    return forecastDate >= now && forecastDate <= endDate
  })
}

// racuna dan za svaki datum
//za sve iste datume ko prvi prikazuje TODAY a za ostale ime dana
function getDayLabel(
  dateString: string,
  firstDateString?: string,) {
  const date = parseForecastDate(dateString)
  const firstDate = firstDateString ? parseForecastDate(firstDateString) : null
  const currentDay = date.toLocaleDateString("en-CA")
  const firstDay = firstDate ? firstDate.toLocaleDateString("en-CA") : null
  const sameDay = firstDay && currentDay === firstDay

  if (sameDay) {
    return "Today"
  }

  return date.toLocaleDateString("en-GB", {
    weekday: "long",
  })
}

// za sve sate jednog dana uzima srednji index i tu stavi label dana
function getDayMidpointIndexes(
  labels: string[],
) {
  //key je index srednjeg sata, value je labela dana
  const midpoints = new Map<number, string>()
  // svi datumi + sati jednog dana 
  const groupedIndexes = new Map<string, number[]>()


  // za svaki datum napravi listu indexa s tim datumima
  labels.forEach((label, index) => {
    const dayKey = parseForecastDate(label).toLocaleDateString("en-CA")
    const indexes = groupedIndexes.get(dayKey) ?? []
    indexes.push(index)
    groupedIndexes.set(dayKey, indexes)
  })

  // za svaku tu lsitu indexa
  //uzima srednji index i na njega stavi labelu dana
  groupedIndexes.forEach((indexes) => {
    const midpointIndex = indexes[Math.floor(indexes.length / 2)]
    const label = labels[midpointIndex]

    if (label) {
      midpoints.set(midpointIndex, getDayLabel(label, labels[0]))
    }
  })

  return midpoints
}
// samo racuna koje dane ce priakzat jer ne mogu svi stat
function getVisibleDayMidpoints(dayMidpoints: Map<number, string>, maxVisibleLabels = 5) {
  const midpointEntries = Array.from(dayMidpoints.entries())

  if (midpointEntries.length <= maxVisibleLabels) {
    return dayMidpoints
  }

  const visibleMidpoints = new Map<number, string>()
  const lastIndex = midpointEntries.length - 1
  const step = Math.ceil(lastIndex / Math.max(maxVisibleLabels - 1, 1))

  midpointEntries.forEach(([index, label], position) => {
    const isFirst = position === 0
    const isLast = position === lastIndex
    const shouldShow = isFirst || isLast || position % step === 0

    if (shouldShow) {
      visibleMidpoints.set(index, label)
    }
  })

  return visibleMidpoints
}

// pretvra string u datum
function getFullTooltipLabel(dateString: string) {
  return parseForecastDate(dateString).toLocaleString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

// samo vizualno za gradient da bude
function getMetricGradient(
  context: ScriptableContext<"line">,
  startColor: string,
  endColor: string,
) {
  const { chart } = context
  const { ctx, chartArea } = chart

  if (!chartArea) {
    return startColor
  }

  const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)
  gradient.addColorStop(0, startColor)
  gradient.addColorStop(1, endColor)

  return gradient
}

// prikaza pdoataka za svaku tocnku na grafu
function getOrCreateTooltip(chart: ChartJS) {
  const parent = chart.canvas.parentElement

  if (!(parent instanceof HTMLElement)) {
    return null
  }

  let tooltipEl = parent.querySelector<HTMLDivElement>(
    "div[data-chart-tooltip='temperature']",
  )

  if (!tooltipEl) {
    tooltipEl = document.createElement("div")
    tooltipEl.dataset.chartTooltip = "temperature"
    tooltipEl.style.position = "absolute"
    tooltipEl.style.pointerEvents = "none"
    tooltipEl.style.transform = "translate(-50%, calc(-100% - 14px))"
    tooltipEl.style.transition = "all 120ms ease"
    tooltipEl.style.opacity = "0"
    tooltipEl.style.borderRadius = "22px"
    tooltipEl.style.background = "linear-gradient(180deg, #6fbcff 0%, #4974ef 100%)"
    tooltipEl.style.boxShadow = "0 16px 40px rgba(0, 0, 0, 0.24)"
    tooltipEl.style.padding = "12px 16px"
    tooltipEl.style.minWidth = "176px"
    tooltipEl.style.zIndex = "20"
    parent.appendChild(tooltipEl)
  }

  return tooltipEl
}

// minja zadani Chart.js tooltip nasim tooltipomom.
function externalTooltipHandler(
  context: any,
  labels: string[],
  metric: GraphMetric,
  unit: string,
) {
  const { chart, tooltip } = context
  const tooltipEl = getOrCreateTooltip(chart)

  if (!tooltipEl) {
    return
  }

  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = "0"
    return
  }

  const forecastTime = labels[tooltip.dataPoints?.[0]?.dataIndex ?? 0]
  const value = tooltip.dataPoints?.[0]?.formattedValue
  const config = metricConfig[metric]

  tooltipEl.style.background = `linear-gradient(180deg, ${config.endColor} 0%, ${config.startColor} 100%)`

  tooltipEl.innerHTML = `
    <div style="font-size: 12px; font-weight: 300; color: rgba(255,255,255,0.82); margin-bottom: 6px; white-space: nowrap;">
      ${forecastTime ? getFullTooltipLabel(forecastTime) : ""}
    </div>
    <div style="font-size: 28px; font-weight: 700; line-height: 1; color: white; text-align: center;">
      ${value ? `${value}${unit}` : ""}
    </div>
  `

  const { offsetLeft, offsetTop } = chart.canvas
  tooltipEl.style.opacity = "1"
  tooltipEl.style.left = `${offsetLeft + tooltip.caretX}px`
  tooltipEl.style.top = `${offsetTop + tooltip.caretY}px`
}

// main metoda
export function GraphPanel({ forecast, meta }: GraphPanelProps) {
  const [metric, setMetric] = useState<GraphMetric>("temperature")
  const chartItems = useMemo(() => getChartItems(forecast), [forecast])

  const config = metricConfig[metric]
  const unit = meta[config.metaKey]?.unitDisplayName ?? config.fallbackUnit
  const labels = chartItems.map((item) => item.forecastTime)
  const values = chartItems.map(config.getValue)

  if (chartItems.length === 0) {
    return <div className="xl:col-span-2 rounded-4xl bg-div p-6" />
  }

  const dayMidpoints = getDayMidpointIndexes(labels)
  const visibleDayMidpoints = getVisibleDayMidpoints(dayMidpoints)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const minY = Math.max(config.minValue ?? Number.NEGATIVE_INFINITY, Math.floor(minValue - 3))
  const maxY = Math.ceil(maxValue + 3)

  return (
    <div className="xl:col-span-2 flex h-full min-h-0 min-w-0 flex-col overflow-visible rounded-4xl bg-div p-6">
      <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 w-full">
          <p className="text-[26px]">
            Overview
          </p>

          <div className="flex flex-wrap items-center gap-2 rounded-full bg-white/6 p-1">
            {(Object.keys(metricConfig) as GraphMetric[]).map((option) => {
              const isActive = metric === option
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setMetric(option)}
                  style={
                    isActive
                      ? {
                          background: `linear-gradient(180deg, ${metricConfig[option].endColor} 0%, ${metricConfig[option].startColor} 100%)`,
                          color: "white",
                        }
                      : undefined
                  }
                  className={`rounded-full px-3 py-1.5 text-sm transition ${
                    isActive
                      ? ""
                      : "text-subtext hover:text-white"
                  }`}
                >
                  {metricConfig[option].label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
      <div className="relative min-h-0 flex-1">
        <Line
          data={{
            labels,
            datasets: [
              {
                label: config.label,
                data: values,
                borderColor: (context) =>
                  getMetricGradient(
                    context,
                    config.startColor,
                    config.endColor,
                  ),
                borderWidth: 3,
                tension: 0.45,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHitRadius: 18,
                fill: false,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              mode: "index",
              intersect: false,
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                enabled: false,
                external: (context) =>
                  externalTooltipHandler(context, labels, metric, unit),
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: "rgba(255, 255, 255, 0.55)",
                  maxRotation: 0,
                  autoSkip: false,
                  callback: (_value, index) => visibleDayMidpoints.get(index) ?? "",
                },
                border: {
                  display: false,
                },
              },
              y: {
                min: minY,
                max: maxY,
                ticks: {
                  color: "rgba(255, 255, 255, 0.55)",
                  stepSize: 2,
                  callback: (value) => {
                    if (metric === "precipitation" && Number(value) === maxY) {
                      return ""
                    }

                    return `${value}${unit}`
                  },
                },
                grid: {
                  color: (context: any) => {
                    if (
                      metric === "precipitation" &&
                      Number(context.tick.value) === maxY
                    ) {
                      return "rgba(255, 255, 255, 0)"
                    }

                    return "rgba(255, 255, 255, 0.08)"
                  },
                  borderDash: [3, 5],
                } as never,
                border: {
                  display: false,
                },
                afterFit: (scale) => {
                  scale.width += 8
                },
              },
            },
          }}
        />
      </div>
    </div>
  )
}

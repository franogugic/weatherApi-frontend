import { useState } from "react"
import type { WeatherForecastItem } from "@/entities/weather/model/types"
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
}

type GraphMetric = "temperature" | "precipitation" | "wind"

const metricConfig = {
  temperature: {
    label: "Temperature",
    unit: "°",
    tickUnit: "°",
    minValue: undefined,
    startColor: "#4974ef",
    endColor: "#6fbcff",
    getValue: (item: WeatherForecastItem) => item.airTemperature,
  },
  precipitation: {
    label: "Precipitation",
    unit: " mm",
    tickUnit: " mm",
    minValue: 0,
    startColor: "#7c3aed",
    endColor: "#c084fc",
    getValue: (item: WeatherForecastItem) => item.precipitationAmount,
  },
  wind: {
    label: "Wind",
    unit: " m/s",
    tickUnit: " m/s",
    minValue: 0,
    startColor: "#15803d",
    endColor: "#4ade80",
    getValue: (item: WeatherForecastItem) => item.windSpeed,
  },
} satisfies Record<
  GraphMetric,
  {
    label: string
    unit: string
    tickUnit: string
    minValue?: number
    startColor: string
    endColor: string
    getValue: (item: WeatherForecastItem) => number
  }
>

// Uzima podatke samo za odredjeni N broj dana (defaultno danas + 2 dana)
function getChartItems(forecast: WeatherForecastItem[]) {
  const now = new Date()
  const endDate = new Date(now)
  endDate.setDate(endDate.getDate() + 2)
  endDate.setHours(23, 59, 59, 999)

  return forecast.filter((item) => {
    const forecastDate = new Date(item.forecastTime)
    return forecastDate >= now && forecastDate <= endDate
  })
}

// racuna dan za svaki datum
function getDayLabel(dateString: string, firstDateString?: string) {
  const date = new Date(dateString)
  const firstDate = firstDateString ? new Date(firstDateString) : null
  const sameDay =
    firstDate &&
    date.getFullYear() === firstDate.getFullYear() &&
    date.getMonth() === firstDate.getMonth() &&
    date.getDate() === firstDate.getDate()

  if (sameDay) {
    return "Today"
  }

  return date.toLocaleDateString("en-GB", {
    weekday: "long",
  })
}

// grupira indexe datuma po danima  
function getDayMidpointIndexes(labels: string[]) {
  const midpoints = new Map<number, string>()
  const groupedIndexes = new Map<string, number[]>()


  labels.forEach((label, index) => {
    const dayKey = new Date(label).toDateString()
    const indexes = groupedIndexes.get(dayKey) ?? []
    indexes.push(index)
    groupedIndexes.set(dayKey, indexes)
  })

  groupedIndexes.forEach((indexes) => {
    const midpointIndex = indexes[Math.floor(indexes.length / 2)]
    const label = labels[midpointIndex]

    if (label) {
      midpoints.set(midpointIndex, getDayLabel(label, labels[0]))
    }
  })

  return midpoints
}

// pretvra string u datum
function getFullTooltipLabel(dateString: string) {
  return new Date(dateString).toLocaleString("en-GB", {
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
      ${value ? `${value}${config.unit}` : ""}
    </div>
  `

  const { offsetLeft, offsetTop } = chart.canvas
  tooltipEl.style.opacity = "1"
  tooltipEl.style.left = `${offsetLeft + tooltip.caretX}px`
  tooltipEl.style.top = `${offsetTop + tooltip.caretY}px`
}

// main metoda
export function GraphPanel({ forecast }: GraphPanelProps) {
  const [metric, setMetric] = useState<GraphMetric>("temperature")
  const chartItems = getChartItems(forecast)
  if (chartItems.length === 0) {
    return <div className="col-span-2 bg-div rounded-4xl p-6" />
  }

  const config = metricConfig[metric]
  const labels = chartItems.map((item) => item.forecastTime)
  const values = chartItems.map((item) => config.getValue(item))
  const dayMidpoints = getDayMidpointIndexes(labels)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const minY = Math.max(config.minValue ?? Number.NEGATIVE_INFINITY, Math.floor(minValue - 3))
  const maxY = Math.ceil(maxValue + 3)

  return (
    <div className="col-span-2 flex min-h-0 h-full flex-col overflow-visible rounded-4xl bg-div p-6">
      <div className="mb-3 flex shrink-0 items-center justify-between gap-4">
        <p className="text-[22px] font-semibold">Overview</p>
        <div className="flex items-center gap-2 rounded-full bg-white/6 p-1">
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
                external: (context) => externalTooltipHandler(context, labels, metric),
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
                  callback: (_value, index) => {
                    return dayMidpoints.get(index) ?? ""
                  },
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

                    return `${value}${config.tickUnit}`
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

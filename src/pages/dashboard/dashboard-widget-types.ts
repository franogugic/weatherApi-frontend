import type { ReactNode } from "react"
import type {
  WeatherForecastItem,
  WeatherMeta,
} from "@/entities/weather/model/types"
import type { User } from "@/entities/user/types"

export type DashboardWidgetId =
  | "currentForecast"
  | "nextHourly"
  | "map"
  | "graph"
  | "colorPanelOne"
  | "colorPanelTwo"
  | "colorPanelThree"
  | "colorPanelFour"

export type DashboardWidgetRenderProps = {
  currentForecast: WeatherForecastItem
  forecast: WeatherForecastItem[]
  nextHourlyForecast: WeatherForecastItem[]
  meta: WeatherMeta
  user: User | null
}

export type DashboardWidgetDefinition = {
  id: DashboardWidgetId
  title: string
  defaultLayout: {
    w: number
    h: number
  }
  render: (props: DashboardWidgetRenderProps) => ReactNode
}

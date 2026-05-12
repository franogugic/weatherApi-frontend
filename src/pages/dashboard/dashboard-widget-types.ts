import type { ReactNode } from "react"
import type {
  WeatherForecastItem,
  WeatherMeta,
} from "@/entities/weather/model/types"
import type { User } from "@/entities/user/types"
import type { DashboardWidgetId } from "@/features/dashboard-layout/dashboard-layout-types"
import type { DashboardCellId } from "@/features/dashboard-layout/dashboard-layout-types"

export type DashboardWidgetRenderProps = {
  currentForecast: WeatherForecastItem
  forecast: WeatherForecastItem[]
  nextHourlyForecast: WeatherForecastItem[]
  meta: WeatherMeta
  user: User | null
  blockCellCount?: number
  blockCellIds?: DashboardCellId[]
  isVerticalBlock?: boolean
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

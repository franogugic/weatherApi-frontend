import { useDashboardLayoutStore } from "@/features/dashboard-layout/dashboard-layout-store"
import { dashboardWidgetRegistry } from "./dashboard-widget-registry"
import type { DashboardWidgetRenderProps } from "./dashboard-widget-types"
import { Fragment, type ReactNode } from "react"

type DashboardWidgetGridProps = DashboardWidgetRenderProps & {
  afterFirstWidget?: ReactNode
}

export function DashboardWidgetGrid({ afterFirstWidget, ...props }: DashboardWidgetGridProps) {
  const layout = useDashboardLayoutStore((state) => state.layout)

  return (
    <>
      {layout.map((item, index) => {
        const widget = dashboardWidgetRegistry[item.i]
        const renderedWidget = widget.render(props)

        return (
          <Fragment key={item.i}>
            {item.i === "map" ? (
              <div className="hidden lg:block">{renderedWidget}</div>
            ) : (
              renderedWidget
            )}
            {index === 0 ? afterFirstWidget : null}
          </Fragment>
        )
      })}
    </>
  )
}

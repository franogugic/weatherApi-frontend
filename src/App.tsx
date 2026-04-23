import { ForecastProvider } from "@/features/get-weather-forecast/model/forecast-context"
import { LocationProvider } from "@/features/selected-location/model/location-context"
import { TimezoneProvider } from "@/features/selected-timezone/model/timezone-context"
import { AppLayout } from "./shared/ui/app-layout/AppLayout"
import { ForecastPage } from "./pages/forecast/ui/ForecastPage"
import { DashboardPage } from "./pages/dashboard/ui/DashboardPage"
import { useLocation } from "react-router-dom"

function App() {
  const location = useLocation()
  const isDashboardRoute = location.pathname === "/"
  const isForecastRoute = location.pathname === "/forecast"

  return (
    <LocationProvider>
      <TimezoneProvider>
        <ForecastProvider>
          <AppLayout >
            <div className={isDashboardRoute ? "h-full" : "hidden"} aria-hidden={!isDashboardRoute}>
              <DashboardPage />
            </div>
            <div className={isForecastRoute ? "h-full" : "hidden"} aria-hidden={!isForecastRoute}>
              <ForecastPage />
            </div>
          </AppLayout>
        </ForecastProvider>
      </TimezoneProvider>
    </LocationProvider>
  )
}

export default App

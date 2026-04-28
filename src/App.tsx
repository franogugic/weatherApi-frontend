import { ForecastProvider } from "@/features/get-weather-forecast/model/forecast-context"
import { useLocationStore } from "@/features/location/model/location-store"
import { useEffect } from "react"
import { AppLayout } from "./shared/ui/app-layout/AppLayout"
import { ForecastPage } from "./pages/forecast/ui/ForecastPage"
import { DashboardPage } from "./pages/dashboard/ui/DashboardPage"
import { useLocation } from "react-router-dom"

function App() {
  const fetchLocations = useLocationStore((state) => state.fetchLocations)
  const location = useLocation()
  const isDashboardRoute = location.pathname === "/"
  const isForecastRoute = location.pathname === "/forecast"

  useEffect(() => {
    void fetchLocations()
  }, [fetchLocations])


  return (
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
  )
}

export default App

import { useLocationStore } from "@/features/location/model/location-store"
import { useEffect } from "react"
import { AppLayout } from "./shared/ui/app-layout/AppLayout"
import { ForecastPage } from "./pages/forecast/ui/ForecastPage"
import { DashboardPage } from "./pages/dashboard/ui/DashboardPage"
import { useLocation } from "react-router-dom"
import { useForecastStore } from "./features/get-weather-forecast/model/forecast-store"

function App() {
  const fetchLocations = useLocationStore((state) => state.fetchLocations)
  const fetchForecast = useForecastStore((state) => state.fetchForecast)
  const location = useLocation()
  const isDashboardRoute = location.pathname === "/"
  const isForecastRoute = location.pathname === "/forecast"

  useEffect(() => {
    void fetchLocations()
    void fetchForecast(202) // hardkoidrani id loikacij
    // TODO: NEMOJ ZABORAVIT IZMINIT OVO!!!
  }, [fetchLocations, fetchForecast])


  return (
            <AppLayout >
              <div className={isDashboardRoute ? "h-full" : "hidden"} aria-hidden={!isDashboardRoute}>
                <DashboardPage />
              </div>
              <div className={isForecastRoute ? "h-full" : "hidden"} aria-hidden={!isForecastRoute}>
                <ForecastPage />
              </div>
            </AppLayout>
  )
}

export default App

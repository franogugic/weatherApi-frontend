import { ForecastProvider } from "@/features/get-weather-forecast/model/forecast-context"
import { LocationProvider } from "@/features/selected-location/model/location-context"
import { TimezoneProvider } from "@/features/selected-timezone/model/timezone-context"
import { AppLayout } from "./shared/ui/app-layout/AppLayout"
import { DashboardPage } from "./pages/dashboard/ui/DashboardPage"

function App() {

  return (
    <LocationProvider>
      <TimezoneProvider>
        <ForecastProvider>
          <AppLayout >
            <DashboardPage />
          </AppLayout>
        </ForecastProvider>
      </TimezoneProvider>
    </LocationProvider>
  )
}

export default App

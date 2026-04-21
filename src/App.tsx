import { LocationProvider } from "@/features/selected-location/model/location-context"
import { TimezoneProvider } from "@/features/selected-timezone/model/timezone-context"
import { DashboardPage } from "./pages/dashboard/ui/DashboardPage"
import { AppLayout } from "./shared/ui/app-layout/AppLayout"

function App() {

  return (
    <LocationProvider>
      <TimezoneProvider>
        <AppLayout >
          <DashboardPage />
        </AppLayout>
      </TimezoneProvider>
    </LocationProvider>
  )
}

export default App

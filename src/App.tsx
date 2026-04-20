import { LocationProvider } from "@/features/selected-location/model/location-context"
import { DashboardPage } from "./pages/dashboard/ui/DashboardPage"
import { AppLayout } from "./shared/ui/app-layout/AppLayout"

function App() {

  return (
    <LocationProvider>
      <AppLayout >
        <DashboardPage />
      </AppLayout>
    </LocationProvider>
  )
}

export default App

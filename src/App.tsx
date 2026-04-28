import { useLocationStore } from "@/features/location/model/location-store"
import { useEffect } from "react"
import { Navigate, Outlet, Route, Routes, useParams } from "react-router-dom"
import { useForecastStore } from "./features/get-weather-forecast/model/forecast-store"
import { DashboardPage } from "./pages/dashboard/ui/DashboardPage"
import { ForecastPage } from "./pages/forecast/ui/ForecastPage"
import { MapPage } from "./pages/map/MapPage"
import { AppLayout } from "./shared/ui/app-layout/AppLayout"

function LocationDataLoader() {
  const { id } = useParams()
  const locations = useLocationStore((state) => state.locations)
  const setSelectedLocation = useLocationStore((state) => state.setSelectedLocation)
  const fetchForecast = useForecastStore((state) => state.fetchForecast)

  useEffect(() => {
    const locationId = Number(id)

    if (!locationId) {
      return
    }

    void fetchForecast(locationId)

    const matchedLocation = locations.find((location) => location.id === locationId)

    if (matchedLocation) {
      setSelectedLocation(matchedLocation)
    }
  }, [id, locations, setSelectedLocation, fetchForecast])

  return <Outlet />
}

function App() {
  const fetchLocations = useLocationStore((state) => state.fetchLocations)

  useEffect(() => {
    void fetchLocations()
  }, [fetchLocations])

  return (
    <AppLayout>
      <Routes>
        <Route path="/map" element={<MapPage />} />
        <Route element={<LocationDataLoader />}>
          <Route path="/dashboard/:id/:locationSlug" element={<DashboardPage />} />
          <Route path="/forecast/:id/:locationSlug" element={<ForecastPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/map" replace />} />
      </Routes>
    </AppLayout>
  )
}

export default App

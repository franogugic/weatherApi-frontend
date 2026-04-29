import { useLocationStore } from "@/features/location/location-store"
import { useEffect } from "react"
import { Navigate, Outlet, Route, Routes, useParams } from "react-router-dom"
import { parseForecastDate } from "./shared/lib/parse-forecast-date"
import {
  DEFAULT_TEMPERATURE_THEME,
  getTemperatureTheme,
} from "./shared/lib/get-temperature-theme"
import { useForecastStore } from "./features/get-weather-forecast/forecast-store"
import { DashboardPage } from "./pages/dashboard/DashboardPage"
import { ForecastPage } from "./pages/forecast/ForecastPage"
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

function TemperatureThemeSync() {
  const forecast = useForecastStore((state) => state.forecast)

  useEffect(() => {
    const now = new Date()
    const currentForecast =
      [...forecast]
        .reverse()
        .find((item) => parseForecastDate(item.forecastTime) <= now) ?? forecast[0]

    const theme = currentForecast
      ? getTemperatureTheme(currentForecast.airTemperature)
      : DEFAULT_TEMPERATURE_THEME

    document.documentElement.style.setProperty("--accent-primary", theme.primary)
    document.documentElement.style.setProperty("--accent-secondary", theme.secondary)
  }, [forecast])

  return null
}

function App() {
  const fetchLocations = useLocationStore((state) => state.fetchLocations)

  useEffect(() => {
    void fetchLocations()
  }, [fetchLocations])

  return (
    <AppLayout>
      <TemperatureThemeSync />
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

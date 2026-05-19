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
import { RegisterPage } from "./pages/register/RegisterPage"
import { LoginPage } from "./pages/login/LoginPage"
import { SettingsPage } from "./pages/settings/SettingsPage"
import { useAuthStore } from "./features/auth/auth-store"
import { useUnitPreferenceStore } from "./features/unit-preferences/unit-preference-store"
import { LAST_VIEWED_LOCATION_ID_KEY } from "./features/location/last-viewed-location"
import { useFavoriteLocationStore } from "./features/favorite-locations/favorite-locations-store"
import { useDashboardLayoutStore } from "./features/dashboard-layout/dashboard-layout-store"

function AuthSessionLoader() {
  const user = useAuthStore((state) => state.user)
  const hasLoadedCurrentUser = useAuthStore((state) => state.hasLoadedCurrentUser)
  const loadCurrentUser = useAuthStore((state) => state.loadCurrentUser)
  const loadPreferences = useUnitPreferenceStore((state) => state.loadPreferences)
  const loadFavoriteLocations = useFavoriteLocationStore((state) => state.loadFavoriteLocations)
  const clearFavoriteLocations = useFavoriteLocationStore((state) => state.clearFavoriteLocations)
  const resetDashboardLayout = useDashboardLayoutStore((state) => state.resetDashboardLayout)
  const loadDashboardLayout = useDashboardLayoutStore((state) => state.loadDashboardLayout)

  useEffect(() => {
    void loadCurrentUser()
  }, [loadCurrentUser])

  useEffect(() => {
    if (!hasLoadedCurrentUser) {
      return
    }

    if (!user) {
      clearFavoriteLocations()
      void resetDashboardLayout()
      return
    }

    void Promise.all([
      loadPreferences(),
      loadFavoriteLocations(),
      loadDashboardLayout(),
    ])
  }, [
    clearFavoriteLocations,
    hasLoadedCurrentUser,
    loadDashboardLayout,
    loadFavoriteLocations,
    loadPreferences,
    resetDashboardLayout,
    user,
  ])

  return null
}

function LocationDataLoader() {
  const { id } = useParams()
  const locations = useLocationStore((state) => state.locations)
  const setSelectedLocation = useLocationStore((state) => state.setSelectedLocation)
  const fetchForecast = useForecastStore((state) => state.fetchForecast)
  const clearForecast = useForecastStore((state) => state.clearForecast)
  const locationId = Number(id)
  const isLocationIdValid = Number.isInteger(locationId) && locationId > 0

  useEffect(() => {
    if (!isLocationIdValid) {
      clearForecast()
      return
    }

    localStorage.setItem(LAST_VIEWED_LOCATION_ID_KEY, String(locationId))
    void fetchForecast(locationId)
  }, [clearForecast, fetchForecast, isLocationIdValid, locationId])

  useEffect(() => {
    if (!isLocationIdValid) {
      setSelectedLocation(null)
      return
    }

    const matchedLocation = locations.find((location) => location.id === locationId)

    if (matchedLocation) {
      setSelectedLocation(matchedLocation)
      return
    }

    if (!locations.length) {
      return
    }

    setSelectedLocation(null)
  }, [isLocationIdValid, locationId, locations, setSelectedLocation])

  if (!isLocationIdValid) {
    return <Navigate to="/map" replace />
  }

  return <Outlet />
}

function RootPage() {
  const user = useAuthStore((state) => state.user)
  const hasLoadedCurrentUser = useAuthStore((state) => state.hasLoadedCurrentUser)

  if (!hasLoadedCurrentUser) {
    return null
  }

  const lastViewedLocationId = localStorage.getItem(LAST_VIEWED_LOCATION_ID_KEY)

  if (user && lastViewedLocationId) {
    return <Navigate to={`/${lastViewedLocationId}`} replace />
  }

  return <MapPage showAuthActions />
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
      <AuthSessionLoader />
      <TemperatureThemeSync />
      <Routes>
        <Route path="/" element={<RootPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route element={<LocationDataLoader />}>
          <Route path="/:id" element={<DashboardPage />} />
          <Route path="/forecast/:id" element={<ForecastPage />} />
        </Route>
        <Route path="/register" element={<RegisterPage/>}></Route>
        <Route path="/login" element={<LoginPage/>}></Route>
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/map" replace />} />
      </Routes>
    </AppLayout>
  )
}

export default App

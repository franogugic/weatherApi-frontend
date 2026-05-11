import { useAuthStore } from "@/features/auth/auth-store"
import { useFavoriteLocationStore } from "@/features/favorite-locations/favorite-locations-store"
import { useLocationStore } from "@/features/location/location-store"
import { MapView, type MapMarker } from "@/shared/ui/map/MapView"
import { MessageState } from "@/shared/ui/status/MessageState"
import { useTranslation } from "react-i18next"
import { NavLink, useNavigate } from "react-router-dom"
import { MapPageSkeleton } from "./MapPageSkeleton"
import { useUnitPreferenceStore } from "@/features/unit-preferences/unit-preference-store"
import { formatTemperature } from "@/features/unit-preferences/format-units"
import { AvailableLocationsPanel } from "./AvailableLocationsPanel"
import { FavoriteLocationsPanel } from "./FavoriteLocationsPanel"
import { useEffect } from "react"

type MapPageProps = {
  showAuthActions?: boolean
}

export function MapPage({ showAuthActions = false }: MapPageProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const locations = useLocationStore((state) => state.locations)
  const isLoading = useLocationStore((state) => state.isLoading)
  const favoriteLocations = useFavoriteLocationStore((state) => state.favoriteLocations)
      console.log(favoriteLocations);

  const isLoadingFavorites = useFavoriteLocationStore((state) => state.isLoadingFavorites)
  const hasLoadedFavorites = useFavoriteLocationStore((state) => state.hasLoadedFavorites)
  const loadFavoriteLocations = useFavoriteLocationStore((state) => state.loadFavoriteLocations)
  const temperatureUnit = useUnitPreferenceStore((state) => state.preferences.temperatureUnit)
  const isSignedIn = Boolean(user)
  const favoriteLocationCards = favoriteLocations.map(
    (favoriteLocation) =>
      locations.find((location) => location.id === favoriteLocation.id) ?? favoriteLocation,
  )
  const mapMarkers: MapMarker[] = locations.map((location) => ({
    ...location,
    weatherSymbol: location.currentWeather?.weatherSymbol ?? undefined,
    temperatureText:
      location.currentWeather?.airTemperature !== null &&
      location.currentWeather?.airTemperature !== undefined
        ? formatTemperature(location.currentWeather.airTemperature, temperatureUnit)
        : undefined,
  }))

  useEffect(() => {
    if (!isSignedIn || hasLoadedFavorites) {
      return
    }

    void loadFavoriteLocations()
  }, [hasLoadedFavorites, isSignedIn, loadFavoriteLocations])

  if (isLoading) {
    return <MapPageSkeleton />
  }

  if (!locations.length) {
    return (
      <div className="rounded-4xl bg-div p-6">
        <MessageState message={t("map.noLocations")} />
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-bold sm:text-2xl">{t("map.title")}</h1>
        {showAuthActions ? (
          <div className="flex items-center gap-2">
            <NavLink
              to="/login"
              className="rounded-2xl border border-white/10 px-4 py-2 text-[14px] font-semibold text-white/80 transition hover:border-white/20 hover:text-white"
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className="rounded-2xl bg-linear-to-b from-accent-secondary to-accent-primary px-4 py-2 text-[14px] font-semibold text-white shadow-sm transition hover:brightness-110"
            >
              Register
            </NavLink>
          </div>
        ) : null}
      </div>
      <div className={`flex min-h-0 flex-1 flex-col gap-4 ${isSignedIn ? "" : "xl:flex-row"}`}>
        <div className="min-h-[320px] overflow-hidden rounded-4xl md:min-h-[420px] xl:min-h-0 xl:flex-1">
          <MapView
            markers={mapMarkers}
            zoom={7}
            onMarkerClick={(marker) => navigate(`/${marker.id}`)}
          />
        </div>

        {isSignedIn ? (
          <FavoriteLocationsPanel
            locations={favoriteLocationCards}
            temperatureUnit={temperatureUnit}
            isLoading={isLoadingFavorites}
          />
        ) : (
          <AvailableLocationsPanel
            locations={locations}
            temperatureUnit={temperatureUnit}
          />
        )}
      </div>
    </div>
  )
}

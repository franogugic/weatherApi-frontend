import { useLocationStore } from "@/features/location/location-store"
import { useAuthStore } from "@/features/auth/auth-store"
import { formatTemperature } from "@/features/unit-preferences/format-units"
import { useUnitPreferenceStore } from "@/features/unit-preferences/unit-preference-store"
import { MapView, type MapMarker } from "@/shared/ui/map/MapView"
import { MessageState } from "@/shared/ui/status/MessageState"
import { useTranslation } from "react-i18next"
import { NavLink, useNavigate } from "react-router-dom"
import { AvailableLocationsPanel } from "./AvailableLocationsPanel"
import { MapPageSkeleton } from "./MapPageSkeleton"

type MapPageProps = {
  showAuthActions?: boolean
}

export function MapPage({ showAuthActions: _showAuthActions }: MapPageProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const hasLoadedCurrentUser = useAuthStore((state) => state.hasLoadedCurrentUser)
  const locations = useLocationStore((state) => state.locations)
  const isLoadingLocations = useLocationStore((state) => state.isLoading)
  const hasLoadedLocations = useLocationStore((state) => state.hasLoadedLocations)
  const temperatureUnit = useUnitPreferenceStore((state) => state.preferences.temperatureUnit)
  const showAuthActions = _showAuthActions || (hasLoadedCurrentUser && !user)
  const mapMarkers: MapMarker[] = locations.map((location) => ({
    ...location,
    temperatureText:
      location.currentWeather?.airTemperature !== null &&
      location.currentWeather?.airTemperature !== undefined
        ? formatTemperature(location.currentWeather.airTemperature, temperatureUnit)
        : undefined,
    weatherSymbol: location.currentWeather?.weatherSymbol ?? undefined,
  }))

  if (isLoadingLocations || !hasLoadedLocations) {
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
    <div className="flex min-h-0 flex-col lg:h-full">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-bold sm:text-2xl">{t("map.title")}</h1>
        {showAuthActions ? (
          <div className="flex items-center gap-2">
            <NavLink
              to="/login"
              className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:bg-white/8 hover:text-white"
            >
              {t("common.login")}
            </NavLink>
            <NavLink
              to="/register"
              className="relative overflow-hidden rounded-full bg-linear-to-r from-accent-secondary to-accent-primary px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(0,0,0,0.18)] transition hover:brightness-110"
            >
              <span className="absolute inset-0 bg-black/20" />
              <span className="relative z-10">{t("common.register")}</span>
            </NavLink>
          </div>
        ) : null}
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-4 xl:flex-row">
        <div className="min-h-[360px] overflow-hidden rounded-4xl sm:min-h-[460px] xl:min-h-0 xl:flex-1">
          <MapView
            markers={mapMarkers}
            zoom={7}
            onMarkerClick={(marker) => navigate(`/${marker.id}`)}
          />
        </div>

        <AvailableLocationsPanel locations={locations} temperatureUnit={temperatureUnit} />
      </div>
    </div>
  )
}

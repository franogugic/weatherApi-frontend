import { useLocationStore } from "@/features/location/location-store"
import { getLocationSlug } from "@/shared/lib/get-lcoation-slug"
import { MapView, type MapMarker } from "@/shared/ui/map/MapView"
import { LoadingState } from "@/shared/ui/status/LoadingState"
import { MessageState } from "@/shared/ui/status/MessageState"
import { useTranslation } from "react-i18next"
import { NavLink, useNavigate } from "react-router-dom"

export function MapPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const locations = useLocationStore((state) => state.locations)
  const isLoading = useLocationStore((state) => state.isLoading)
  const mapMarkers: MapMarker[] = locations

  if (isLoading) {
    return (
      <div className="rounded-4xl bg-div p-6">
        <LoadingState message={t("map.loadingLocations")} />
      </div>
    )
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
      <h1 className="mb-4 text-xl font-bold sm:text-2xl">{t("map.title")}</h1>
      <div className="flex min-h-0 flex-1 flex-col gap-4 xl:flex-row">
        <div className="min-h-[320px] overflow-hidden rounded-4xl md:min-h-[420px] xl:min-h-0 xl:flex-1">
          <MapView
            markers={mapMarkers}
            zoom={7}
            onMarkerClick={(marker) => navigate(`/dashboard/${getLocationSlug(marker)}`)}
          />
        </div>

        <div className="flex max-h-[360px] min-h-0 flex-col rounded-4xl bg-div p-4 sm:max-h-[420px] sm:p-6 xl:h-full xl:max-h-none xl:w-[320px] xl:shrink-0">
          <p className="mb-4 bg-linear-to-b from-accent-secondary to-accent-primary bg-clip-text text-center text-xl text-transparent sm:mb-6 sm:text-[26px]">
            {t("map.availableLocations")}
          </p>
          <ul className="min-h-0 flex-1 overflow-y-auto">
          {locations.map((location) => (
            <li key={location.id} >
              <NavLink to={`/dashboard/${getLocationSlug(location)}`} className="block border-y border-white/20 p-4 transition-colors hover:bg-white/8">
                <p className="mb-2 text-base font-semibold sm:text-[18px]">{location.name}</p>
                <div className="flex items-center justify-between">
                  <div className="text-[12px] font-semibold flex flex-col gap-1">
                    <p><span className="text-subtext  font-light">{t("map.latitude")}:</span> {location.latitude}</p>
                    <p><span className="text-subtext font-light">{t("map.longitude")}:</span> {location.longitude}</p>
                    <p><span className="text-subtext font-light">{t("map.altitude")}:</span> {location.altitude}</p>
                  </div>
                </div>
              </NavLink>
            </li>
          ))}
          </ul>
      </div>
      </div>
    </div>
  )
}

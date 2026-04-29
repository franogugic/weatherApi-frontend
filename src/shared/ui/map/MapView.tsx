import { GoogleMap, Marker, OverlayView, useJsApiLoader } from "@react-google-maps/api"
import { WeatherSymbolIcon } from "@/entities/weather/ui/WeatherSymbolIcon"
import { Fragment } from "react"
import { useTranslation } from "react-i18next"
import type { Location } from "@/entities/location/types"

const mapContainerStyle = {
  width: "100%",
  height: "100%",
}

const mapStyles = [
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#313236" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#49484d" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#49484d" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#5a5960" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#434248" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#5a5960" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#d4d5d8" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#313236" }],
  },
]

export type MapMarker = Location & {
  temperatureText?: string
  weatherSymbol?: string
}

type MapViewProps = {
  latitude?: number
  longitude?: number
  zoom?: number
  markers?: MapMarker[]
}

export function MapView({
  latitude,
  longitude,
  zoom = 3,
  markers,
}: MapViewProps) {
  const { t } = useTranslation()
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  })

  const center = markers?.length
    ? {
        lat:
          markers.reduce((sum, marker) => sum + marker.latitude, 0) / markers.length,
        lng:
          markers.reduce((sum, marker) => sum + marker.longitude, 0) / markers.length,
      }
    : {
        lat: latitude ?? 0,
        lng: longitude ?? 0,
      }

  if (!isLoaded) {
    return <div className="flex h-full w-full items-center justify-center text-subtext">{t("map.loading")}</div>
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={zoom}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        styles: mapStyles,
      }}
    >
      {markers?.length
        ? markers.map((marker) => (
            <Fragment key={marker.id}>
              {marker.weatherSymbol ? (
                <OverlayView
                  position={{ lat: marker.latitude, lng: marker.longitude }}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  getPixelPositionOffset={() => ({
                    x: -96,
                    y: -104,
                  })}
                >
                  <div className="flex min-w-[172px] max-w-[260px] flex-col rounded-2xl items-center border border-white/15 bg-white/8 px-3 py-1.5 text-center shadow-lg backdrop-blur-xl">
                    <div className="flex items-center gap-1">
                      <WeatherSymbolIcon symbol={marker.weatherSymbol} className="h-10 w-10" />
                      {marker.temperatureText ? (
                        <p className="text-sm leading-none font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">
                          {marker.temperatureText}
                        </p>
                      ) : null}
                    </div>
                    <p className="text-[11px] leading-none font-medium text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">
                      {marker.name}
                    </p>
                  </div>
                </OverlayView>
              ) : null}
              <Marker
                position={{ lat: marker.latitude, lng: marker.longitude }}
                title={marker.name}
              />
            </Fragment>
          ))
        : <Marker position={center} />}
    </GoogleMap>
  )
}

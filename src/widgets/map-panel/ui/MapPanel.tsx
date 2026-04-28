import { useForecastStore } from "@/features/get-weather-forecast/model/forecast-store"
import { useLocationStore } from "@/features/location/model/location-store"
import { parseForecastDate } from "@/shared/lib/parse-forecast-date"
import { MapView, type MapMarker } from "@/shared/ui/map/MapView"

type MapPanelProps = {
}

export function MapPanel({}: MapPanelProps) {
  const selectedLocation = useLocationStore((state) => state.selectedLocation)
  const { forecast, meta } = useForecastStore()

  const now = new Date()
  const currentForecast =
    [...forecast]
      .reverse()
      .find((item) => parseForecastDate(item.forecastTime) <= now) ?? forecast[0]

  const selectedLocationMarker: MapMarker[] = currentForecast
    ? [
        {
          ...selectedLocation,
          temperatureText: `${currentForecast.airTemperature}${meta.air_temperature?.unitDisplayName ?? "°C"}`,
          weatherSymbol: currentForecast.weatherSymbol,
        },
      ]
    : []

  return (
    <div className="relative h-full min-h-0 overflow-hidden rounded-4xl">
      <MapView
        latitude={selectedLocation.latitude}
        longitude={selectedLocation.longitude}
        markers={selectedLocationMarker}
        zoom={3}
      />
    </div>
  )
}

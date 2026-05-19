import { useForecastStore } from "@/features/get-weather-forecast/forecast-store"
import { useLocationStore } from "@/features/location/location-store"
import { formatTemperature } from "@/features/unit-preferences/format-units"
import { useUnitPreferenceStore } from "@/features/unit-preferences/unit-preference-store"
import { parseForecastDate } from "@/shared/lib/parse-forecast-date"
import { MapView, type MapMarker } from "@/shared/ui/map/MapView"

type MapPanelProps = {
}

export function MapPanel({}: MapPanelProps) {
  const selectedLocation = useLocationStore((state) => state.selectedLocation)
  const { forecast } = useForecastStore()
  const temperatureUnit = useUnitPreferenceStore((state) => state.preferences.temperatureUnit)

  if (!selectedLocation) {
    return null
  }

  const now = new Date()
  const currentForecast =
    [...forecast]
      .reverse()
      .find((item) => parseForecastDate(item.forecastTime) <= now) ?? forecast[0]

  const selectedLocationMarker: MapMarker[] = currentForecast
    ? [
        {
          ...selectedLocation,
          temperatureText: formatTemperature(currentForecast.airTemperature, temperatureUnit),
          weatherSymbol: currentForecast.weatherSymbol,
        },
      ]
    : []

  return (
    <div className="relative h-full min-h-[260px] overflow-hidden rounded-[28px] lg:min-h-0 lg:rounded-4xl">
      <MapView
        latitude={selectedLocation.latitude}
        longitude={selectedLocation.longitude}
        markers={selectedLocationMarker}
        zoom={3}
      />
    </div>
  )
}

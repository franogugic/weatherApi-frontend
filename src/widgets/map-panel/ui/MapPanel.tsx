import { useLocationStore } from "@/features/location/model/location-store"
import { MapView } from "@/shared/ui/map/MapView"

type MapPanelProps = {
}

export function MapPanel({}: MapPanelProps) {
  const { selectedLocation } = useLocationStore()

  return (
    <div className="relative h-full min-h-0 overflow-hidden rounded-4xl">
      <MapView
        latitude={selectedLocation.latitude}
        longitude={selectedLocation.longitude}
        zoom={3}
      />
    </div>
  )
}

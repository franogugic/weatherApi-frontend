import { useLocation } from "@/features/selected-location/model/location-context"
import { MapView } from "@/shared/ui/map/MapView"

type MapPanelProps = {
}

export function MapPanel({}: MapPanelProps) {
  const { selectedLocation } = useLocation()

  return (
    <div className="bg-div relative h-full min-h-0 overflow-hidden rounded-4xl">
      <MapView
        latitude={selectedLocation.latitude}
        longitude={selectedLocation.longitude}
        zoom={3}
      />
    </div>
  )
}

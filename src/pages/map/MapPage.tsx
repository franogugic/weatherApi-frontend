import { useLocationStore } from "@/features/location/model/location-store"
import { MapPanel } from "@/widgets/map-panel/ui/MapPanel"
import { NavLink } from "react-router-dom"

export function MapPage() {
  const locations = useLocationStore((state) => state.locations)

  return (
    <div className="flex h-full flex-col">
      <ul>{locations.map((location) => (
            <li key={location.id}>
              <NavLink to={`/dashboard/${location.id}`}>{location.name}</NavLink>
            </li>
          ))}
      </ul>
      <div className="flex-1 min-h-0">
      <MapPanel />
      </div>
    </div>
  )
}

import { useLocationStore } from "@/features/location/location-store";
import { LAST_VIEWED_LOCATION_ID_KEY } from "@/features/location/last-viewed-location";
import { CloudSun, LayoutDashboard, Map, Settings, Sun } from "lucide-react";
import { NavLink } from "react-router-dom";

export function Sidebar() {
  const selectedLocation = useLocationStore((state) => state.selectedLocation)
  const locations = useLocationStore((state) => state.locations)
  const storedLocationId = localStorage.getItem(LAST_VIEWED_LOCATION_ID_KEY)
  const fallbackLocationId = selectedLocation?.id ?? storedLocationId ?? locations[0]?.id
  const dashboardPath = fallbackLocationId ? `/${fallbackLocationId}` : "/map"
  const forecastPath = fallbackLocationId ? `/forecast/${fallbackLocationId}` : "/map"

  return (
    <aside className="bg-div flex flex-row items-center justify-between rounded-4xl px-6 py-4 xl:flex-col xl:justify-start xl:p-6">
      <NavLink to="/">
        <Sun size={32} className="text-yellow-500 transition-transform duration-200 hover:scale-105 active:scale-95" />
      </NavLink>
      <ul className="my-0 flex flex-row items-center gap-6 xl:my-8 xl:w-full xl:flex-col xl:gap-8 xl:border-y xl:border-white/25 xl:py-8">
        <NavLink to={dashboardPath}>
          {({ isActive }) => (
            <LayoutDashboard className={isActive ? "" : "text-white/50"} />
          )}
        </NavLink>
        <NavLink to={forecastPath}>
          {({ isActive }) => (
            <CloudSun className={isActive ? "" : "text-white/50"} />
          )}
        </NavLink>
        <NavLink to="/map">
          {({ isActive }) => (
            <Map className={isActive ? "" : "text-white/50"} />
          )}
        </NavLink>
        <NavLink to="/settings">
          {({ isActive }) => (
            <Settings className={isActive ? "" : "text-white/50"} />
          )}
        </NavLink>
      </ul>
    </aside>
  )
}

import { useLocationStore } from "@/features/location/location-store";
import { getLocationSlug } from "@/shared/lib/get-lcoation-slug";
import { CloudSun, LayoutDashboard, Map, Sun } from "lucide-react";
import { NavLink } from "react-router-dom";

export function Sidebar() {
  const selectedLocation = useLocationStore((state) => state.selectedLocation)

  return (
    <aside className="bg-div flex flex-row items-center justify-between rounded-4xl px-6 py-4 xl:flex-col xl:justify-start xl:p-6">
      <NavLink to="/">
        <Sun size={32} className="text-yellow-500 transition-transform duration-200 hover:scale-105 active:scale-95" />
      </NavLink>
      <ul className="my-0 flex flex-row items-center gap-6 xl:my-8 xl:w-full xl:flex-col xl:gap-8 xl:border-y xl:border-white/25 xl:py-8">
        <NavLink to={`/dashboard/${getLocationSlug(selectedLocation)}`}>
          {({ isActive }) => (
            <LayoutDashboard className={isActive ? "" : "text-white/50"} />
          )}
        </NavLink>
        <NavLink to={`/forecast/${getLocationSlug(selectedLocation)}`}>
          {({ isActive }) => (
            <CloudSun className={isActive ? "" : "text-white/50"} />
          )}
        </NavLink>
        <NavLink to="/map">
          {({ isActive }) => (
            <Map className={isActive ? "" : "text-white/50"} />
          )}
        </NavLink>
      </ul>
    </aside>
  )
}

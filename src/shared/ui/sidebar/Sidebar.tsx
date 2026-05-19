import { useAuthStore } from "@/features/auth/auth-store";
import { useLocationStore } from "@/features/location/location-store";
import { LAST_VIEWED_LOCATION_ID_KEY } from "@/features/location/last-viewed-location";
import { CloudSun, DoorOpen, LayoutDashboard, Map, Settings, Sun, UserRoundCheck } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

export function Sidebar() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const selectedLocation = useLocationStore((state) => state.selectedLocation)
  const locations = useLocationStore((state) => state.locations)
  const storedLocationId = localStorage.getItem(LAST_VIEWED_LOCATION_ID_KEY)
  const fallbackLocationId = selectedLocation?.id ?? storedLocationId ?? locations[0]?.id
  const dashboardPath = fallbackLocationId ? `/${fallbackLocationId}` : "/map"
  const forecastPath = fallbackLocationId ? `/forecast/${fallbackLocationId}` : "/map"

  async function handleLogout() {
    await logout()
    navigate("/")
  }

  return (
    <aside className="bg-div sticky top-3 z-40 flex flex-row items-center justify-between rounded-[28px] px-4 py-3 sm:px-6 sm:py-4 lg:static lg:rounded-4xl xl:flex-col xl:justify-start xl:p-6">
      <NavLink to="/">
        <Sun size={28} className="text-yellow-500 transition-transform duration-200 hover:scale-105 active:scale-95 sm:size-8" />
      </NavLink>
      <ul className="my-0 flex flex-row items-center gap-3 sm:gap-6 xl:my-8 xl:w-full xl:flex-col xl:gap-8 xl:border-y xl:border-white/25 xl:py-8">
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
      <div className="xl:mt-auto">
        {user ? (
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="text-white/50 transition hover:text-red-300"
            aria-label="Logout"
          >
            <DoorOpen />
          </button>
        ) : (
          <NavLink to="/login" aria-label="Login">
            {({ isActive }) => (
              <UserRoundCheck className={isActive ? "" : "text-white/50"} />
            )}
          </NavLink>
        )}
      </div>
    </aside>
  )
}

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
    <aside className="bg-div flex flex-row items-center justify-between rounded-4xl px-4 py-4 sm:px-6 lg:flex-col lg:justify-start lg:p-6">
      <NavLink to="/">
        <Sun size={32} className="text-yellow-500 transition-transform duration-200 hover:scale-105 active:scale-95" />
      </NavLink>
      <ul className="my-0 flex flex-row items-center gap-4 sm:gap-6 lg:my-8 lg:w-full lg:flex-col lg:gap-8 lg:border-y lg:border-white/25 lg:py-8">
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
      <div className="lg:mt-auto">
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

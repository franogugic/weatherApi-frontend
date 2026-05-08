import { useAuthStore } from "@/features/auth/auth-store"
import { useFavoriteLocationStore } from "@/features/favorite-locations/favorite-locations-store"
import { useLocationStore } from "@/features/location/location-store"
import { useUnitPreferenceStore } from "@/features/unit-preferences/unit-preference-store"
import type {
  CloudinessUnit,
  PrecipitationUnit,
  PressureUnit,
  TemperatureUnit,
  UnitPreferences,
  WindSpeedUnit,
} from "@/features/unit-preferences/unit-preferences-types"
import { useState } from "react"
import { Link } from "react-router-dom"

export function SettingsPage() {
  const user = useAuthStore((state) => state.user)
  const isLoadingUser = useAuthStore((state) => state.isLoadingUser)
  const hasLoadedCurrentUser = useAuthStore((state) => state.hasLoadedCurrentUser)
  const preferences = useUnitPreferenceStore((state) => state.preferences)
  const isLoadingPreferences = useUnitPreferenceStore((state) => state.isLoadingPreferences)
  const updatePreferences = useUnitPreferenceStore((state) => state.updatePreferences)
  const favoriteLocations = useFavoriteLocationStore((state) => state.favoriteLocations);
  const addFavoriteLocation = useFavoriteLocationStore((state) => state.addFavoriteLocation);
  const removeFavoriteLocation = useFavoriteLocationStore((state) => state.removeFavoriteLocation)

  const locations = useLocationStore((state) => state.locations);
  const possibleLocations = locations.filter(
    (location) => !favoriteLocations.some((favorite) => favorite.id === location.id)
  )
  const [selectedNewFavoriteLocation,setSelectedNewFavoriteLocation] = useState(0);
  const [preferenceErrorMessage, setPreferenceErrorMessage] = useState("")

  async function handlePreferenceChange<K extends keyof UnitPreferences>(
    key: K,
    value: UnitPreferences[K],
  ) {
    setPreferenceErrorMessage("")

    try {
      await updatePreferences({
        ...preferences,
        [key]: value,
      })
    } catch (error) {
      console.error("Preference update failed:", error)
      setPreferenceErrorMessage(error instanceof Error ? error.message : "Could not update preferences.")
    }
  }

  if (isLoadingUser || !hasLoadedCurrentUser) {
    return (
      <div className="rounded-4xl bg-div p-6">
        <p className="text-subtext">Loading settings...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center rounded-4xl bg-div p-6">
        <div className="max-w-md text-center">
          <h1 className="mb-2 text-3xl font-semibold">Settings</h1>
          <p className="mb-6 text-sm text-subtext">
            Login to customize measurement units.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/login"
              className="rounded-2xl border border-white/10 px-5 py-2 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:text-white"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-2xl bg-linear-to-b from-accent-secondary to-accent-primary px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-4xl bg-div p-6">
      <div className="mb-8">
        <p className="text-sm text-subtext">Signed in as</p>
        <h1 className="text-3xl font-semibold">
          {user.firstName} {user.lastName}
        </h1>
      </div>

      <div className="max-w-md space-y-5">
        <UnitSelect
          label="Temperature"
          value={preferences.temperatureUnit}
          onChange={(value) => void handlePreferenceChange("temperatureUnit", value as TemperatureUnit)}
          options={[
            { value: "celsius", label: "Celsius (°C)" },
            { value: "fahrenheit", label: "Fahrenheit (°F)" },
            { value: "kelvin", label: "Kelvin (K)" },
          ]}
        />

        <UnitSelect
          label="Wind speed"
          value={preferences.windSpeedUnit}
          onChange={(value) => void handlePreferenceChange("windSpeedUnit", value as WindSpeedUnit)}
          options={[
            { value: "metersPerSecond", label: "Meters per second (m/s)" },
            { value: "kilometersPerHour", label: "Kilometers per hour (km/h)" },
            { value: "milesPerHour", label: "Miles per hour (mph)" },
            { value: "knots", label: "Knots (kt)" },
          ]}
        />

        <UnitSelect
          label="Air pressure"
          value={preferences.pressureUnit}
          onChange={(value) => void handlePreferenceChange("pressureUnit", value as PressureUnit)}
          options={[
            { value: "hectopascal", label: "Hectopascal (hPa)" },
            { value: "pascal", label: "Pascal (Pa)" },
            { value: "millibar", label: "Millibar (mbar)" },
          ]}
        />

        <UnitSelect
          label="Cloudiness"
          value={preferences.cloudinessUnit}
          onChange={(value) => void handlePreferenceChange("cloudinessUnit", value as CloudinessUnit)}
          options={[
            { value: "percent", label: "Percent (%)" },
            { value: "okta", label: "Okta" },
          ]}
        />

        <UnitSelect
          label="Precipitation"
          value={preferences.precipitationUnit}
          onChange={(value) => void handlePreferenceChange("precipitationUnit", value as PrecipitationUnit)}
          options={[
            { value: "millimeter", label: "Millimeter (mm)" },
            { value: "literPerSquareMeter", label: "Liter per square meter (l/m²)" },
          ]}
        />

        {preferenceErrorMessage ? (
          <p className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-[13px] text-red-300">
            {preferenceErrorMessage}
          </p>
        ) : null}

        <p className="text-xs text-subtext">
          {isLoadingPreferences ? "Loading saved preferences..." : "Preferences are saved to your account."}
        </p>
        <div>
          <p className="bg-yellow-900">Popis favorit lokacija</p>
          <ul>
            {favoriteLocations.map((loc) => 
              (
                <p onClick={() => removeFavoriteLocation(loc.id)} key={loc.id}>{loc.name}</p>
              )
            )}
          </ul>
          <p className="bg-green-900 mt-8">potencijalne lokacije <span className="font-bold underline">DAUN DER</span></p>
          <form action=""
            onSubmit={(event) => {
              event.preventDefault()
              addFavoriteLocation(selectedNewFavoriteLocation)
            }}>
            <ul>
              {possibleLocations.map((loc) => 
              (
                <p key={loc.id} onClick={() => setSelectedNewFavoriteLocation(loc.id)}>{loc.name}</p>
              )
              )}
            </ul>
            <button className="bg-green-300 text-black">dodaj novu lokaciju u favorite</button>
          </form>
        </div>
      </div>
    </div>
  )
}

type UnitSelectProps = {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{
    value: string
    label: string
  }>
}

function UnitSelect({ label, value, onChange, options }: UnitSelectProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-white">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-[#25272C] px-4 py-3 text-sm text-white outline-none transition focus:border-accent-primary"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

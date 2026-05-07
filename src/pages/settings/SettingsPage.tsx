import type { User } from "@/entities/user/types"
import { getCurrentUser } from "@/features/auth/get-current-user"
import { useUnitPreferenceStore } from "@/features/unit-preferences/unit-preference-store"
import type {
  CloudinessUnit,
  PrecipitationUnit,
  PressureUnit,
  TemperatureUnit,
  WindSpeedUnit,
} from "@/features/unit-preferences/unit-preferences-types"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const temperatureUnit = useUnitPreferenceStore((state) => state.temperatureUnit)
  const windSpeedUnit = useUnitPreferenceStore((state) => state.windSpeedUnit)
  const pressureUnit = useUnitPreferenceStore((state) => state.pressureUnit)
  const cloudinessUnit = useUnitPreferenceStore((state) => state.cloudinessUnit)
  const precipitationUnit = useUnitPreferenceStore((state) => state.precipitationUnit)
  const setTemperatureUnit = useUnitPreferenceStore((state) => state.setTemperatureUnit)
  const setWindSpeedUnit = useUnitPreferenceStore((state) => state.setWindSpeedUnit)
  const setPressureUnit = useUnitPreferenceStore((state) => state.setPressureUnit)
  const setCloudinessUnit = useUnitPreferenceStore((state) => state.setCloudinessUnit)
  const setPrecipitationUnit = useUnitPreferenceStore((state) => state.setPrecipitationUnit)

  useEffect(() => {
    let isMounted = true

    async function loadCurrentUser() {
      try {
        const currentUser = await getCurrentUser()

        if (isMounted) {
          setUser(currentUser)
        }
      } catch {
        if (isMounted) {
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setIsLoadingUser(false)
        }
      }
    }

    loadCurrentUser()

    return () => {
      isMounted = false
    }
  }, [])

  if (isLoadingUser) {
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
          value={temperatureUnit}
          onChange={(value) => setTemperatureUnit(value as TemperatureUnit)}
          options={[
            { value: "celsius", label: "Celsius (°C)" },
            { value: "fahrenheit", label: "Fahrenheit (°F)" },
            { value: "kelvin", label: "Kelvin (K)" },
          ]}
        />

        <UnitSelect
          label="Wind speed"
          value={windSpeedUnit}
          onChange={(value) => setWindSpeedUnit(value as WindSpeedUnit)}
          options={[
            { value: "metersPerSecond", label: "Meters per second (m/s)" },
            { value: "kilometersPerHour", label: "Kilometers per hour (km/h)" },
            { value: "milesPerHour", label: "Miles per hour (mph)" },
            { value: "knots", label: "Knots (kt)" },
          ]}
        />

        <UnitSelect
          label="Air pressure"
          value={pressureUnit}
          onChange={(value) => setPressureUnit(value as PressureUnit)}
          options={[
            { value: "hectopascal", label: "Hectopascal (hPa)" },
            { value: "pascal", label: "Pascal (Pa)" },
            { value: "millibar", label: "Millibar (mbar)" },
          ]}
        />

        <UnitSelect
          label="Cloudiness"
          value={cloudinessUnit}
          onChange={(value) => setCloudinessUnit(value as CloudinessUnit)}
          options={[
            { value: "percent", label: "Percent (%)" },
            { value: "okta", label: "Okta" },
          ]}
        />

        <UnitSelect
          label="Precipitation"
          value={precipitationUnit}
          onChange={(value) => setPrecipitationUnit(value as PrecipitationUnit)}
          options={[
            { value: "millimeter", label: "Millimeter (mm)" },
            { value: "literPerSquareMeter", label: "Liter per square meter (l/m²)" },
          ]}
        />

        <p className="text-xs text-subtext">
          These preferences are temporary for now and reset after refresh.
        </p>
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

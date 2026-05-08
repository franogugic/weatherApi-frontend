export type TemperatureUnit = "celsius" | "fahrenheit" | "kelvin"
export type WindSpeedUnit = "metersPerSecond" | "kilometersPerHour" | "milesPerHour" | "knots"
export type PressureUnit = "hectopascal" | "pascal" | "millibar"
export type CloudinessUnit = "percent" | "okta"
export type PrecipitationUnit = "millimeter" | "literPerSquareMeter"

export type UnitPreferences = {
  temperatureUnit: TemperatureUnit
  windSpeedUnit: WindSpeedUnit
  pressureUnit: PressureUnit
  cloudinessUnit: CloudinessUnit
  precipitationUnit: PrecipitationUnit
}

export type UnitPreferenceStore = {
  preferences: UnitPreferences
  isLoadingPreferences: boolean
  hasLoadedPreferences: boolean
  setPreference: <K extends keyof UnitPreferences>(
    key: K,
    value: UnitPreferences[K]
  ) => void
  setPreferences: (preferences: UnitPreferences) => void
  loadPreferences: () => Promise<UnitPreferences | null>
  updatePreferences: (preferences: UnitPreferences) => Promise<UnitPreferences>
}

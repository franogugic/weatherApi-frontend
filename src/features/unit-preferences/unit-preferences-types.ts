export type TemperatureUnit = "celsius" | "fahrenheit" | "kelvin"
export type WindSpeedUnit = "metersPerSecond" | "kilometersPerHour" | "milesPerHour" | "knots"
export type PressureUnit = "hectopascal" | "pascal" | "millibar"
export type CloudinessUnit = "percent" | "okta"
export type PrecipitationUnit = "millimeter" | "literPerSquareMeter"

export type UnitPreferenceState = {
    temperatureUnit: TemperatureUnit
    windSpeedUnit: WindSpeedUnit
    pressureUnit: PressureUnit
    cloudinessUnit: CloudinessUnit
    precipitationUnit: PrecipitationUnit
    setTemperatureUnit: (unit: TemperatureUnit) => void
    setWindSpeedUnit: (unit: WindSpeedUnit) => void
    setPressureUnit: (unit: PressureUnit) => void
    setCloudinessUnit: (unit: CloudinessUnit) => void
    setPrecipitationUnit: (unit: PrecipitationUnit) => void
}

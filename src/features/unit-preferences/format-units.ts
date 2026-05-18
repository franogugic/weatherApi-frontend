import type {
  CloudinessUnit,
  PrecipitationUnit,
  PressureUnit,
  TemperatureUnit,
  WindSpeedUnit,
} from "./unit-preferences-types"

export function convertTemperature(
  valueInCelsius: number,
  unit: TemperatureUnit,
) {
  if (unit === "fahrenheit") {
    return valueInCelsius * 9 / 5 + 32
  }

  if (unit === "kelvin") {
    return valueInCelsius + 273.15
  }

  return valueInCelsius
}

export function getTemperatureUnitLabel(
  unit: TemperatureUnit,
  defaultUnitLabel?: string,
) {
  if (unit === "fahrenheit") {
    return "°F"
  }

  if (unit === "kelvin") {
    return "K"
  }

  return defaultUnitLabel ?? "°C"
}

export function formatTemperature(
  valueInCelsius: number,
  unit: TemperatureUnit,
  defaultUnitLabel?: string,
) {
  const convertedValue = convertTemperature(valueInCelsius, unit)

  return `${roundToOneDecimal(convertedValue)} ${getTemperatureUnitLabel(unit, defaultUnitLabel)}`
}

export function convertWindSpeed(
  valueInMetersPerSecond: number,
  unit: WindSpeedUnit,
) {
  if (unit === "kilometersPerHour") {
    return valueInMetersPerSecond * 3.6
  }

  if (unit === "milesPerHour") {
    return valueInMetersPerSecond * 2.236936
  }

  if (unit === "knots") {
    return valueInMetersPerSecond * 1.943844
  }

  return valueInMetersPerSecond
}

export function getWindSpeedUnitLabel(
  unit: WindSpeedUnit,
  defaultUnitLabel?: string,
) {
  if (unit === "kilometersPerHour") {
    return "km/h"
  }

  if (unit === "milesPerHour") {
    return "mph"
  }

  if (unit === "knots") {
    return "kt"
  }

  return defaultUnitLabel ?? "m/s"
}

export function formatWindSpeed(
  valueInMetersPerSecond: number,
  unit: WindSpeedUnit,
  defaultUnitLabel?: string,
) {
  const convertedValue = convertWindSpeed(valueInMetersPerSecond, unit)

  return `${roundToOneDecimal(convertedValue)} ${getWindSpeedUnitLabel(unit, defaultUnitLabel)}`
}

export function convertPressure(
  valueInHectopascal: number,
  unit: PressureUnit,
) {
  if (unit === "pascal") {
    return valueInHectopascal * 100
  }

  return valueInHectopascal
}

export function getPressureUnitLabel(
  unit: PressureUnit,
  defaultUnitLabel?: string,
) {
  if (unit === "pascal") {
    return "Pa"
  }

  if (unit === "millibar") {
    return "mbar"
  }

  return defaultUnitLabel ?? "hPa"
}

export function formatPressure(
  valueInHectopascal: number,
  unit: PressureUnit,
  defaultUnitLabel?: string,
) {
  const convertedValue = convertPressure(valueInHectopascal, unit)

  return `${roundToOneDecimal(convertedValue)} ${getPressureUnitLabel(unit, defaultUnitLabel)}`
}

export function convertCloudiness(
  valueInPercent: number,
  unit: CloudinessUnit,
) {
  if (unit === "okta") {
    return valueInPercent / 100 * 8
  }

  return valueInPercent
}

export function getCloudinessUnitLabel(
  unit: CloudinessUnit,
  defaultUnitLabel?: string,
) {
  if (unit === "okta") {
    return "okta"
  }

  return defaultUnitLabel ?? "%"
}

export function formatCloudiness(
  valueInPercent: number,
  unit: CloudinessUnit,
  defaultUnitLabel?: string,
) {
  const convertedValue = convertCloudiness(valueInPercent, unit)

  return `${roundToOneDecimal(convertedValue)} ${getCloudinessUnitLabel(unit, defaultUnitLabel)}`
}

export function convertPrecipitation(
  valueInMillimeter: number,
  _unit: PrecipitationUnit,
) {
  return valueInMillimeter
}

export function getPrecipitationUnitLabel(
  unit: PrecipitationUnit,
  defaultUnitLabel?: string,
) {
  if (unit === "literPerSquareMeter") {
    return "l/m²"
  }

  return defaultUnitLabel ?? "mm"
}

export function formatPrecipitation(
  valueInMillimeter: number,
  unit: PrecipitationUnit,
  defaultUnitLabel?: string,
) {
  const convertedValue = convertPrecipitation(valueInMillimeter, unit)

  return `${roundToOneDecimal(convertedValue)} ${getPrecipitationUnitLabel(unit, defaultUnitLabel)}`
}

function roundToOneDecimal(value: number) {
  return Math.round(value * 10) / 10
}

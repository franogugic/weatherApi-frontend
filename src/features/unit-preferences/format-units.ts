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

export function getTemperatureUnitLabel(unit: TemperatureUnit) {
  if (unit === "fahrenheit") {
    return "°F"
  }

  if (unit === "kelvin") {
    return "K"
  }

  return "°C"
}

export function formatTemperature(
  valueInCelsius: number,
  unit: TemperatureUnit,
) {
  const convertedValue = convertTemperature(valueInCelsius, unit)

  return `${roundToOneDecimal(convertedValue)} ${getTemperatureUnitLabel(unit)}`
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

export function getWindSpeedUnitLabel(unit: WindSpeedUnit) {
  if (unit === "kilometersPerHour") {
    return "km/h"
  }

  if (unit === "milesPerHour") {
    return "mph"
  }

  if (unit === "knots") {
    return "kt"
  }

  return "m/s"
}

export function formatWindSpeed(
  valueInMetersPerSecond: number,
  unit: WindSpeedUnit,
) {
  const convertedValue = convertWindSpeed(valueInMetersPerSecond, unit)

  return `${roundToOneDecimal(convertedValue)} ${getWindSpeedUnitLabel(unit)}`
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

export function getPressureUnitLabel(unit: PressureUnit) {
  if (unit === "pascal") {
    return "Pa"
  }

  if (unit === "millibar") {
    return "mbar"
  }

  return "hPa"
}

export function formatPressure(
  valueInHectopascal: number,
  unit: PressureUnit,
) {
  const convertedValue = convertPressure(valueInHectopascal, unit)

  return `${roundToOneDecimal(convertedValue)} ${getPressureUnitLabel(unit)}`
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

export function getCloudinessUnitLabel(unit: CloudinessUnit) {
  if (unit === "okta") {
    return "okta"
  }

  return "%"
}

export function formatCloudiness(
  valueInPercent: number,
  unit: CloudinessUnit,
) {
  const convertedValue = convertCloudiness(valueInPercent, unit)

  return `${roundToOneDecimal(convertedValue)} ${getCloudinessUnitLabel(unit)}`
}

export function convertPrecipitation(
  valueInMillimeter: number,
  _unit: PrecipitationUnit,
) {
  return valueInMillimeter
}

export function getPrecipitationUnitLabel(unit: PrecipitationUnit) {
  if (unit === "literPerSquareMeter") {
    return "l/m²"
  }

  return "mm"
}

export function formatPrecipitation(
  valueInMillimeter: number,
  unit: PrecipitationUnit,
) {
  const convertedValue = convertPrecipitation(valueInMillimeter, unit)

  return `${roundToOneDecimal(convertedValue)} ${getPrecipitationUnitLabel(unit)}`
}

function roundToOneDecimal(value: number) {
  return Math.round(value * 10) / 10
}

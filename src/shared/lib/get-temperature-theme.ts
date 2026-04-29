export type TemperatureTheme = {
  primary: string
  secondary: string
}

export const DEFAULT_TEMPERATURE_THEME: TemperatureTheme = {
  primary: "#22C55E",
  secondary: "#86EFAC",
}

export function getTemperatureTheme(temperature: number): TemperatureTheme {
  if (temperature <= -10) {
    return {
      primary: "#3B82F6",
      secondary: "#4FD1FF",
    }
  }

  if (temperature <= 0) {
    return {
      primary: "#2563EB",
      secondary: "#5BC0FA",
    }
  }

  if (temperature <= 8) {
    return {
      primary: "#14B8A6",
      secondary: "#5ED9B6",
    }
  }

  if (temperature <= 16) {
    return {
      primary: "#22C55E",
      secondary: "#86EFAC",
    }
  }

  if (temperature <= 24) {
    return {
      primary: "#F59E0B",
      secondary: "#FACC15",
    }
  }

  if (temperature <= 30) {
    return {
      primary: "#F97316",
      secondary: "#FB923C",
    }
  }

  if (temperature <= 36) {
    return {
      primary: "#E11D48",
      secondary: "#F87171",
    }
  }

  return {
    primary: "#7C3AED",
    secondary: "#E879F9",
  }
}

import { create } from "zustand";
import type { UnitPreferenceState } from "./unit-preferences-types";

export const useUnitPreferenceStore = create<UnitPreferenceState>((set) => ({
  temperatureUnit: "celsius",
  windSpeedUnit: "metersPerSecond",
  pressureUnit: "hectopascal",
  cloudinessUnit: "percent",
  precipitationUnit: "millimeter",
  setTemperatureUnit: (temperatureUnit) => set({ temperatureUnit }),
  setWindSpeedUnit: (windSpeedUnit) => set({ windSpeedUnit }),
  setPressureUnit: (pressureUnit) => set({ pressureUnit }),
  setCloudinessUnit: (cloudinessUnit) => set({ cloudinessUnit }),
  setPrecipitationUnit: (precipitationUnit) => set({ precipitationUnit }),
}))

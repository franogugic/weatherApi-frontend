import type {
  CloudinessUnit,
  PrecipitationUnit,
  PressureUnit,
  TemperatureUnit,
  UnitPreferences,
  WindSpeedUnit,
} from "@/features/unit-preferences/unit-preferences-types";
import {
  Cloud,
  CloudRain,
  Gauge,
  Wind,
  Thermometer,
} from "lucide-react";
import { UnitSelect } from "./UnitSelect";
import { LinearText } from "../linear-text/LinearText";

type SettingsUnitsBlockProps = {
  preferences: UnitPreferences;
  handlePreferenceChange: <K extends keyof UnitPreferences>(
    key: K,
    value: UnitPreferences[K],
  ) => Promise<void>;
  preferenceErrorMessage: string;
  compact?: boolean;
  showHeader?: boolean;
  showDropdownChevron?: boolean;
};

export function SettingsUnitsBlock({
  preferences,
  handlePreferenceChange,
  preferenceErrorMessage,
  compact = false,
  showHeader = true,
  showDropdownChevron = true,
}: SettingsUnitsBlockProps) {
  return (
    <div>
      {showHeader ? (
        <>
          <LinearText
            text="Units"
            className={compact ? "text-[16px] font-semibold" : "text-[20px] font-semibold"}
          />
          {!compact ? (
            <p className="mt-1 mb-6 text-[12px] font-light text-white/60">
              Choose your preferred weather units.
            </p>
          ) : null}
        </>
      ) : null}

      <div className={`grid  ${
        compact
          ? "mt-2 grid-cols-2 gap-2 pt-2"
          : `${showHeader ? "max-h-75" : ""} grid-cols-1 gap-4 overflow-y-auto pt-4 lg:grid-cols-2`
      }`}>
        <UnitSelect
          label="Temperature"
          value={preferences.temperatureUnit}
          icon={Thermometer}
          compact={compact}
          showChevron={showDropdownChevron}
          onChange={(value) =>
            void handlePreferenceChange(
              "temperatureUnit",
              value as TemperatureUnit,
            )
          }
          options={[
            {
              value: "celsius",
              label: "Celsius (°C)",
            },
            {
              value: "fahrenheit",
              label: "Fahrenheit (°F)",
            },
            {
              value: "kelvin",
              label: "Kelvin (K)",
            },
          ]}
        />

        <UnitSelect
          label="Wind speed"
          value={preferences.windSpeedUnit}
          icon={Wind}
          compact={compact}
          showChevron={showDropdownChevron}
          onChange={(value) =>
            void handlePreferenceChange("windSpeedUnit", value as WindSpeedUnit)
          }
          options={[
            {
              value: "metersPerSecond",
              label: "m/s",
            },
            {
              value: "kilometersPerHour",
              label: "km/h",
            },
            {
              value: "milesPerHour",
              label: "mph",
            },
            {
              value: "knots",
              label: "Knots",
            },
          ]}
        />

        <UnitSelect
          label="Pressure"
          value={preferences.pressureUnit}
          icon={Gauge}
          compact={compact}
          showChevron={showDropdownChevron}
          onChange={(value) =>
            void handlePreferenceChange("pressureUnit", value as PressureUnit)
          }
          options={[
            {
              value: "hectopascal",
              label: "hPa",
            },
            {
              value: "pascal",
              label: "Pa",
            },
            {
              value: "millibar",
              label: "mbar",
            },
          ]}
        />

        <UnitSelect
          label="Cloudiness"
          value={preferences.cloudinessUnit}
          icon={Cloud}
          compact={compact}
          showChevron={showDropdownChevron}
          onChange={(value) =>
            void handlePreferenceChange(
              "cloudinessUnit",
              value as CloudinessUnit,
            )
          }
          options={[
            {
              value: "percent",
              label: "Percent (%)",
            },
            {
              value: "okta",
              label: "Okta",
            },
          ]}
        />

        <UnitSelect
          label="Precipitation"
          value={preferences.precipitationUnit}
          icon={CloudRain}
          compact={compact}
          showChevron={showDropdownChevron}
          onChange={(value) =>
            void handlePreferenceChange(
              "precipitationUnit",
              value as PrecipitationUnit,
            )
          }
          options={[
            {
              value: "millimeter",
              label: "mm",
            },
            {
              value: "literPerSquareMeter",
              label: "l/m²",
            },
          ]}
        />
      </div>

      {preferenceErrorMessage ? (
        <p className="mt-3 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {preferenceErrorMessage}
        </p>
      ) : null}
    </div>
  );
}

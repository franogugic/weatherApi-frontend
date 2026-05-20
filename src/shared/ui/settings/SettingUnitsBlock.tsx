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
  RotateCcw,
} from "lucide-react";
import { UnitSelect } from "./UnitSelect";
import { LinearText } from "../linear-text/LinearText";
import { useTranslation } from "react-i18next";

type SettingsUnitsBlockProps = {
  preferences: UnitPreferences;
  handlePreferenceChange: <K extends keyof UnitPreferences>(
    key: K,
    value: UnitPreferences[K],
  ) => Promise<void>;
  preferenceErrorMessage: string;
  compact?: boolean;
  onResetDefaults?: () => void;
  isResetDisabled?: boolean;
  showHeader?: boolean;
  showDropdownChevron?: boolean;
};

export function SettingsUnitsBlock({
  preferences,
  handlePreferenceChange,
  preferenceErrorMessage,
  compact = false,
  onResetDefaults,
  isResetDisabled = false,
  showHeader = true,
  showDropdownChevron = true,
}: SettingsUnitsBlockProps) {
  const { t } = useTranslation()
  return (
    <div>
      {showHeader ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <LinearText
              text={t("units.title")}
              className={compact ? "text-[16px] font-semibold" : "text-[20px] font-semibold"}
            />
            {onResetDefaults ? (
              <button
                type="button"
                onClick={onResetDefaults}
                disabled={isResetDisabled}
                className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-[#20252c]/80 px-3 py-2 text-[12px] font-semibold text-white/70 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RotateCcw size={14} />
                {t("units.resetDefaults")}
              </button>
            ) : null}
          </div>
          {!compact ? (
            <p className="mt-1 mb-6 text-[12px] font-light text-white/60">
              {t("units.subtitle")}
            </p>
          ) : null}
        </>
      ) : null}

      <div className={`grid  ${
        compact
          ? "mt-2 grid-cols-2 gap-2 pt-2"
          : `${showHeader ? "lg:max-h-75" : ""} grid-cols-1 gap-4 pt-4 lg:grid-cols-2 lg:overflow-y-auto`
      }`}>
        <UnitSelect
          label={t("units.temperature")}
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
              label: t("units.celsius"),
            },
            {
              value: "fahrenheit",
              label: t("units.fahrenheit"),
            },
            {
              value: "kelvin",
              label: t("units.kelvin"),
            },
          ]}
        />

        <UnitSelect
          label={t("units.windSpeed")}
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
              label: t("units.knots"),
            },
          ]}
        />

        <UnitSelect
          label={t("units.pressure")}
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
          label={t("units.cloudiness")}
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
              label: t("units.percent"),
            },
            {
              value: "okta",
              label: t("units.okta"),
            },
          ]}
        />

        <UnitSelect
          label={t("units.precipitation")}
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

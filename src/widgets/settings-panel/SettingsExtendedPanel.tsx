import { LANGUAGE_OPTIONS } from "@/features/language/language-options";
import { useLanguageStore } from "@/features/language/language-store";
import { useUnitPreferenceStore } from "@/features/unit-preferences/unit-preference-store";
import type {
  CloudinessUnit,
  PrecipitationUnit,
  PressureUnit,
  TemperatureUnit,
  UnitPreferences,
  WindSpeedUnit,
} from "@/features/unit-preferences/unit-preferences-types";
import { useEffect, useRef, useState } from "react";

export function SettingsExtendedPanel() {
  const preferences = useUnitPreferenceStore((state) => state.preferences);
  const updatePreferences = useUnitPreferenceStore(
    (state) => state.updatePreferences,
  );

  async function handlePreferenceChange<K extends keyof UnitPreferences>(
    key: K,
    value: UnitPreferences[K],
  ) {
    try {
      await updatePreferences({
        ...preferences,
        [key]: value,
      });
    } catch (error) {
      console.error("Preference update failed:", error);
    }
  }

  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedLanguage =
    LANGUAGE_OPTIONS.find((option) => option.value === language) ??
    LANGUAGE_OPTIONS[0];

  return (
    <div className="flex h-full min-h-0 flex-col rounded-4xl bg-div p-6">
      <p className="text-[22px] font-semibold mb-4">Settings</p>
      <div className="grid grid-cols-2 grid-rows-[1fr_2fr] h-full ">
       {/*JEZIK*/}
        <div className="col-start-1 row-start-1 border-white/20 border-t-[1px] border-b-[1px] border-l-[1px] p-4">
          <p className="text-[18px] font-semibold mb-4 bg-linear-to-r from-accent-secondary to-accent-primary bg-clip-text text-transparent">
            Language
          </p>
        <div className="flex gap-2 items-center justify-between">
          <div
            ref={dropdownRef}
            className="relative h-fit w-fit self-start z-95"
          >
            <button
              type="button"
              onClick={() => setIsOpen((current) => !current)}
              className="flex items-center gap-2 rounded-2xl bg-linear-to-b from-accent-secondary to-accent-primary px-4  text-white outline-none transition"
            >
              <span>{selectedLanguage.flag}</span>
              <span className="text-[14px] font-bold">
                {selectedLanguage.label}
              </span>
            </button>

            {isOpen ? (
              <div className="absolute top-full right-0 z-20 mt-2 min-w-[220px] rounded-4xl border border-white/15 bg-white/8 p-4 shadow-lg backdrop-blur-xl">
                {LANGUAGE_OPTIONS.map((option, index) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setLanguage(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full rounded-3xl px-3 py-2 text-left transition ${
                      language === option.value
                        ? "text-accent-primary"
                        : "text-subtext"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{option.flag}</span>
                      <span>{option.label}</span>
                    </div>
                    {index < LANGUAGE_OPTIONS.length - 1 ? (
                      <div className="mt-3 border-b border-white/50" />
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        </div>
        {/*STIL*/}
        <div className="col-start-1 row-start-2 border-white/20 border-l-[1px] border-b-[1px] p-4">
          <p className="text-[18px] font-semibold mb-4 bg-linear-to-r from-accent-secondary to-accent-primary bg-clip-text text-transparent">
            Style
          </p>
          <div>
            <p>TODO: color picker</p>
          </div>
        </div>
        {/*UNITI*/}
        <div className="col-start-2 row-span-2 border-[1px] border-white/20 p-4">
          <p className="text-[18px] font-semibold mb-4 bg-linear-to-r from-accent-secondary to-accent-primary bg-clip-text text-transparent">
            Units
          </p>
          <div className="max-w-md space-y-5 grid grid-cols-2 gap-2">
            <UnitSelect
              label="Temperature"
              value={preferences.temperatureUnit}
              onChange={(value) =>
                void handlePreferenceChange(
                  "temperatureUnit",
                  value as TemperatureUnit,
                )
              }
              options={[
                { value: "celsius", label: "Celsius (°C)" },
                { value: "fahrenheit", label: "Fahrenheit (°F)" },
                { value: "kelvin", label: "Kelvin (K)" },
              ]}
            />
            <UnitSelect
              label="Wind speed"
              value={preferences.windSpeedUnit}
              onChange={(value) =>
                void handlePreferenceChange(
                  "windSpeedUnit",
                  value as WindSpeedUnit,
                )
              }
              options={[
                { value: "metersPerSecond", label: "Meters per second (m/s)" },
                {
                  value: "kilometersPerHour",
                  label: "Kilometers per hour (km/h)",
                },
                { value: "milesPerHour", label: "Miles per hour (mph)" },
                { value: "knots", label: "Knots (kt)" },
              ]}
            />

            <UnitSelect
              label="Air pressure"
              value={preferences.pressureUnit}
              onChange={(value) =>
                void handlePreferenceChange(
                  "pressureUnit",
                  value as PressureUnit,
                )
              }
              options={[
                { value: "hectopascal", label: "Hectopascal (hPa)" },
                { value: "pascal", label: "Pascal (Pa)" },
                { value: "millibar", label: "Millibar (mbar)" },
              ]}
            />

            <UnitSelect
              label="Cloudiness"
              value={preferences.cloudinessUnit}
              onChange={(value) =>
                void handlePreferenceChange(
                  "cloudinessUnit",
                  value as CloudinessUnit,
                )
              }
              options={[
                { value: "percent", label: "Percent (%)" },
                { value: "okta", label: "Okta" },
              ]}
            />

            <UnitSelect
              label="Precipitation"
              value={preferences.precipitationUnit}
              onChange={(value) =>
                void handlePreferenceChange(
                  "precipitationUnit",
                  value as PrecipitationUnit,
                )
              }
              options={[
                { value: "millimeter", label: "Millimeter (mm)" },
                {
                  value: "literPerSquareMeter",
                  label: "Liter per square meter (l/m²)",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

type UnitSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
  }>;
};

function UnitSelect({ label, value, onChange, options }: UnitSelectProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-light text-white/60">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-white/10 bg-[#25272C] px-4 py-1 text-sm text-white outline-none "
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

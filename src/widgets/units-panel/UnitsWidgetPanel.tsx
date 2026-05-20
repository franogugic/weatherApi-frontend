import {
  DEFAULT_UNIT_PREFERENCES,
  useUnitPreferenceStore,
} from "@/features/unit-preferences/unit-preference-store";
import type { UnitPreferences } from "@/features/unit-preferences/unit-preferences-types";
import { SettingsUnitsBlock } from "@/shared/ui/settings/SettingUnitsBlock";
import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function UnitsWidgetPanel() {
  const { t } = useTranslation()
  const preferences = useUnitPreferenceStore((state) => state.preferences);
  const updatePreferences = useUnitPreferenceStore(
    (state) => state.updatePreferences,
  );
  const [preferenceErrorMessage, setPreferenceErrorMessage] = useState("");

  async function handlePreferenceChange<K extends keyof UnitPreferences>(
    key: K,
    value: UnitPreferences[K],
  ) {
    try {
      setPreferenceErrorMessage("");
      await updatePreferences({
        ...preferences,
        [key]: value,
      });
    } catch (error) {
      console.error("Preference update failed:", error);
      setPreferenceErrorMessage(
        error instanceof Error ? error.message : t("units.updateFailed"),
      );
    }
  }

  async function handleResetUnitPreferences() {
    try {
      setPreferenceErrorMessage("");
      await updatePreferences(DEFAULT_UNIT_PREFERENCES);
    } catch (error) {
      console.error("Preference reset failed:", error);
      setPreferenceErrorMessage(
        error instanceof Error ? error.message : t("units.updateFailed"),
      );
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col rounded-4xl bg-div p-6">
      <div className="mb-4 flex shrink-0 flex-wrap items-center justify-between gap-3">
        <p className="text-[22px] font-semibold text-white">
          {t("units.widgetTitle")}
        </p>
        <button
          type="button"
          onClick={() => void handleResetUnitPreferences()}
          disabled={JSON.stringify(preferences) === JSON.stringify(DEFAULT_UNIT_PREFERENCES)}
          className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-[#20252c]/80 px-3 py-2 text-[12px] font-semibold text-white/70 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw size={14} />
          {t("units.resetDefaults")}
        </button>
      </div>
      <SettingsUnitsBlock
        preferences={preferences}
        handlePreferenceChange={handlePreferenceChange}
        preferenceErrorMessage={preferenceErrorMessage}
        onResetDefaults={() => void handleResetUnitPreferences()}
        isResetDisabled={
          JSON.stringify(preferences) === JSON.stringify(DEFAULT_UNIT_PREFERENCES)
        }
        showHeader={false}
        showDropdownChevron={false}
      />
    </div>
  );
}

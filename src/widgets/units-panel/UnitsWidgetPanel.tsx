import { useUnitPreferenceStore } from "@/features/unit-preferences/unit-preference-store";
import type { UnitPreferences } from "@/features/unit-preferences/unit-preferences-types";
import { SettingsUnitsBlock } from "@/shared/ui/settings/SettingUnitsBlock";
import { useState } from "react";

export function UnitsWidgetPanel() {
  const preferences = useUnitPreferenceStore((state) => state.preferences);
  const updatePreferences = useUnitPreferenceStore(
    (state) => state.updatePreferences,
  );
  const [preferenceErrorMessage] = useState("");

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

  return (
    <div className="flex h-full min-h-0 flex-col rounded-4xl bg-div p-6">
      <div className="mb-4 shrink-0">
        <p className="mb-4 text-[22px] font-semibold text-white">
          Measurement units
        </p>
      </div>
      <SettingsUnitsBlock
        preferences={preferences}
        handlePreferenceChange={handlePreferenceChange}
        preferenceErrorMessage={preferenceErrorMessage}
        showHeader={false}
        showDropdownChevron={false}
      />
    </div>
  );
}

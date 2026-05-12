import { LANGUAGE_OPTIONS } from "@/features/language/language-options";
import { useLanguageStore } from "@/features/language/language-store";
import { useUnitPreferenceStore } from "@/features/unit-preferences/unit-preference-store";
import type { UnitPreferences } from "@/features/unit-preferences/unit-preferences-types";
import { LanguageDropdown } from "@/shared/ui/settings/LanguageDropdown";
import { SettingsUnitsBlock } from "@/shared/ui/settings/SettingUnitsBlock";
import { useState } from "react";

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

  const [preferenceErrorMessage] = useState("");
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

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
            <LanguageDropdown
              selectedLanguage={selectedLanguage}
              onSelectLanguage={setLanguage}
            />
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
          <SettingsUnitsBlock
            preferences={preferences}
            handlePreferenceChange={handlePreferenceChange}
            preferenceErrorMessage={preferenceErrorMessage}
          />
        </div>
      </div>
    </div>
  );
}

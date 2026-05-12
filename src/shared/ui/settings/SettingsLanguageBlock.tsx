import { LinearText } from "../linear-text/LinearText"
import { LanguageDropdown, type LanguageOption } from "./LanguageDropdown"

type SettingsLanguageBlockProps = {
  selectedLanguage: LanguageOption
  onSelectLanguage: (value: string) => void
  dropdownPlacement?: "auto" | "top" | "bottom"
}



export function SettingsLanguageBlock({
  selectedLanguage,
  onSelectLanguage,
  dropdownPlacement = "auto",
}: SettingsLanguageBlockProps) {
  return (
    <div>
      <LinearText text="Language" className="text-[20px] font-semibold"/>

      <p className="mt-1 mb-6 text-[12px] font-light text-white/60">
        Choose the application language.
      </p>
      <LanguageDropdown
        selectedLanguage={selectedLanguage}
        onSelectLanguage={onSelectLanguage}
        placement={dropdownPlacement}
      />
    </div>
  )
}

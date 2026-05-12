import { LinearText } from "../linear-text/LinearText"
import { LanguageDropdown, type LanguageOption } from "./LanguageDropdown"

type SettingsLanguageBlockProps = {
  selectedLanguage: LanguageOption
  onSelectLanguage: (value: string) => void
  dropdownPlacement?: "auto" | "top" | "bottom"
  compact?: boolean
}



export function SettingsLanguageBlock({
  selectedLanguage,
  onSelectLanguage,
  dropdownPlacement = "auto",
  compact = false,
}: SettingsLanguageBlockProps) {
  return (
    <div>
      <LinearText
        text="Language"
        className={compact ? "text-[16px] font-semibold" : "text-[20px] font-semibold"}
      />

      {!compact ? (
        <p className="mt-1 mb-6 text-[12px] font-light text-white/60">
          Choose the application language.
        </p>
      ) : null}
      <LanguageDropdown
        selectedLanguage={selectedLanguage}
        onSelectLanguage={onSelectLanguage}
        placement={dropdownPlacement}
      />
    </div>
  )
}

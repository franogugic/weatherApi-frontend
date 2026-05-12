import { LANGUAGE_OPTIONS } from "@/features/language/language-options"
import { AppDropdown } from "@/shared/ui/dropdown/AppDropdown"

export type LanguageOption = (typeof LANGUAGE_OPTIONS)[number]


type LanguageDropdownProps = {
  selectedLanguage: LanguageOption
  onSelectLanguage: (value: string) => void
  placement?: "auto" | "top" | "bottom"
}

export function LanguageDropdown({
  selectedLanguage,
  onSelectLanguage,
  placement = "auto",
}: LanguageDropdownProps) {
  return (
    <AppDropdown
      value={selectedLanguage.value}
      options={LANGUAGE_OPTIONS.map((option) => ({
        value: option.value,
        label: option.label,
        leading: <span>{option.flag}</span>,
      }))}
      onChange={onSelectLanguage}
      className="w-full"
      menuClassName="min-w-55"
      placement={placement}
    />
  )
}

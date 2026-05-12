import { LinearText } from "../linear-text/LinearText"
import { LanguageDropdown, type LanguageOption } from "./LanguageDropdown"
import type { Dispatch, RefObject, SetStateAction } from "react"

type SettingsLanguageBlockProps = {
  selectedLanguage: LanguageOption
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  dropdownRef: RefObject<HTMLDivElement>
  onSelectLanguage: (value: string) => void
}



export function SettingsLanguageBlock({
  selectedLanguage,
  isOpen,
  setIsOpen,
  dropdownRef,
  onSelectLanguage,
}: SettingsLanguageBlockProps) {
  return (
    <div>
      <LinearText text="Language" className="text-[20px] font-semibold"/>

      <p className="mt-1 mb-6 text-[12px] font-light text-white/60">
        Choose the application language.
      </p>
      <LanguageDropdown
        selectedLanguage={selectedLanguage}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        dropdownRef={dropdownRef}
        onSelectLanguage={onSelectLanguage}
      />
    </div>
  )
}
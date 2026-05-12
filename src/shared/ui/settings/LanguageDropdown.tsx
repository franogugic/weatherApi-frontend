import { LANGUAGE_OPTIONS } from "@/features/language/language-options"
import type { Dispatch, RefObject, SetStateAction } from "react"

export type LanguageOption = (typeof LANGUAGE_OPTIONS)[number]


type LanguageDropdownProps = {
  selectedLanguage: LanguageOption
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  dropdownRef: RefObject<HTMLDivElement>
  onSelectLanguage: (value: string) => void
}

export function LanguageDropdown({
  selectedLanguage,
  isOpen,
  setIsOpen,
  dropdownRef,
  onSelectLanguage,
}: LanguageDropdownProps) {
  return (
    <div ref={dropdownRef} className="relative h-fit w-full self-start z-95">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="w-full text-start rounded-lg border border-white/10 bg-[#1F2026] px-3 py-1.5 text-xs text-white outline-none transition focus:border-accent-primary"
      >
        <span>{selectedLanguage.flag}</span>
        <span className="text-[14px] font-bold">{selectedLanguage.label}</span>
      </button>

      {isOpen ? (
        <div className="absolute top-full right-0 z-20 mt-2 min-w-55 rounded-4xl border border-white/15 bg-white/8 p-4 shadow-lg backdrop-blur-xl">
          {LANGUAGE_OPTIONS.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelectLanguage(option.value)}
              className={`w-full rounded-3xl px-3 py-2 text-left transition ${
                selectedLanguage.value === option.value
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
  )
}

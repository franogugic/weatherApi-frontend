import { LANGUAGE_OPTIONS } from "@/features/language/language-options"
import { useLanguageStore } from "@/features/language/language-store"
import { useEffect, useRef, useState } from "react"

export function SettingsPanel() {
  const language = useLanguageStore((state) => state.language)
  const setLanguage = useLanguageStore((state) => state.setLanguage)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const selectedLanguage =
    LANGUAGE_OPTIONS.find((option) => option.value === language) ?? LANGUAGE_OPTIONS[0]

  return (
    <div ref={dropdownRef} className="relative ml-auto h-fit w-fit self-start">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex items-center gap-2 rounded-2xl bg-linear-to-b from-lightBlue to-blue px-4 py-2 text-white outline-none transition"
      >
        <span>{selectedLanguage.flag}</span>
        <span className="text-[14px] font-bold">{selectedLanguage.label}</span>
      </button>

      {isOpen ? (
        <div className="absolute top-full right-0 z-20 mt-2 min-w-[220px] rounded-4xl border border-white/15 bg-white/8 p-4 shadow-lg backdrop-blur-xl">
          {LANGUAGE_OPTIONS.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setLanguage(option.value)
                setIsOpen(false)
              }}
              className={`w-full rounded-3xl px-3 py-2 text-left transition ${
                language === option.value ? "text-blue" : "text-subtext"
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

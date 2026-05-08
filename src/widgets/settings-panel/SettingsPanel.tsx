import type { User } from "@/entities/user/types"
import { Link } from "react-router-dom"

type SettingsPanelProps = {
  user: User | null
}

export function SettingsPanel({ user }: SettingsPanelProps) {
  return (
    <div className="flex justify-end gap-4">
      {/*<div ref={dropdownRef} className="relative ml-auto h-fit w-fit self-start">
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="flex items-center gap-2 rounded-2xl bg-linear-to-b from-accent-secondary to-accent-primary px-4 py-2 text-white outline-none transition"
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
                  language === option.value ? "text-accent-primary" : "text-subtext"
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
      </div> */}

      <div>
        {user ? (
          <div className="flex justify-center items-center gap-2">
            <p className="text-[16px] font-light pt-1 text-white">
              <span className="text-[20px] font-extralight">{user.firstName} {user.lastName}</span>
            </p>
            <div className="rounded-full bg-linear-to-br from-accent-secondary cursor-pointer to-accent-primary w-12 h-12 text-white flex items-center justify-center">
              <p className="font-black text-[26px]">{user.firstName[0]}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-2xl border border-white/10 px-4 py-2 text-[14px] font-semibold text-white/80 transition hover:border-white/20 hover:text-white"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-2xl bg-linear-to-b from-accent-secondary to-accent-primary px-4 py-2 text-[14px] font-semibold text-white shadow-sm transition hover:brightness-110"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

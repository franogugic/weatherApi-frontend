import type { User } from "@/entities/user/types"
import { Link } from "react-router-dom"

type SettingsPanelProps = {
  user: User | null
}

export function SettingsPanel({ user }: SettingsPanelProps) {
  return (
    <div className="flex justify-end gap-4">
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

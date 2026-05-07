import type { InputHTMLAttributes } from "react"
import { useId } from "react"
import type { LucideIcon } from "lucide-react"

type AuthInputProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string
    icon: LucideIcon
}

export function AuthInput({ label, icon: Icon, className = "", id, ...inputProps }: AuthInputProps) {
    const generatedId = useId()
    const inputId = id ?? generatedId

    return (
        <div className="flex flex-col">
            <label htmlFor={inputId} className="mb-1 text-[14px] font-light">
                {label}
            </label>
            <div className="relative">
                <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
                <input
                    id={inputId}
                    className={`auth-input w-full rounded-lg border-[1px] border-white/40 bg-[#25272C] py-2 pl-11 pr-4 text-[14px] text-white outline-none placeholder:text-[14px] placeholder:text-white/40 focus:border-white/70 ${className}`}
                    {...inputProps}
                />
            </div>
        </div>
    )
}

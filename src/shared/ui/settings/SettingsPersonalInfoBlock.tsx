import { useAuthStore } from "@/features/auth/auth-store";
import { LinearText } from "../linear-text/LinearText";

export function SettingsPersonalInfoBlock() {
  const user = useAuthStore((state) => state.user);

  return (
    <div>
      <LinearText
        text="Personal information"
        className="text-[20px] font-semibold mb-6"
      />
      <div className="flex items-center justify-start gap-2">
        <div></div>
        <div className="rounded-full bg-linear-to-br from-accent-secondary cursor-pointer to-accent-primary w-12 h-12 text-white flex items-center justify-center">
          <p className="font-black text-[26px]">{user.firstName[0]}</p>
        </div>
        <div className="flex flex-col">
          <p className="text-[22px]">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-[12px] font-extralight text-white/60">
            {user.email}
          </p>
        </div>
      </div>
    </div>
  );
}

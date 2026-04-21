import { CloudSun, LayoutDashboard, Map, Sun } from "lucide-react";

export function Sidebar() {
    return (
        <aside className="bg-div rounded-4xl p-6 flex items-center justify-start flex-col">
            <Sun size={32} className="text-yellow-500"/>
            <ul className="border-y border-white/25 w-full py-8 flex flex-col items-center gap-8 my-8">
                <LayoutDashboard />
                <CloudSun className="text-white/50" />
                <Map className="text-white/50"/>
            </ul>
        </aside>
    )
}

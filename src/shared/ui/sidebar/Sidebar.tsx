import { CloudSun, LayoutDashboard, Map, Sun } from "lucide-react";
import { NavLink } from "react-router-dom";

export function Sidebar() {
    return (
        <aside className="bg-div rounded-4xl p-6 flex items-center justify-start flex-col">
            <NavLink to="/" >
                <Sun size={32} className="text-yellow-500 transition-transform duration-200 hover:scale-105 active:scale-95"/>
            </NavLink>
            <ul className="border-y border-white/25 w-full py-8 flex flex-col items-center gap-8 my-8">
                <NavLink to="/" >
                    {({ isActive }) => (
                        <LayoutDashboard className={isActive ? "" : "text-white/50"} />
                    )}
                </NavLink>
                <NavLink to="/forecast" >
                    {({ isActive }) => (
                        <CloudSun className={isActive ? "" : "text-white/50"} />
                    )}
                </NavLink>
                <NavLink to="/map" >
                    {({ isActive }) => (
                        <Map className={isActive ? "" : "text-white/50"} />
                    )}
                </NavLink>
            </ul>
        </aside>
    )
}
    

import { Search } from "lucide-react";

export function SearchPanel() {
  return <div className="bg-div rounded-4xl flex items-center justify-start px-6">
    <div className="flex items-center gap-2">
      <Search size={22}/>
      <input type="text" placeholder="Search City..." className="bg-transparent border-none focus:outline-none font-extralight" />
    </div>
  </div>
}

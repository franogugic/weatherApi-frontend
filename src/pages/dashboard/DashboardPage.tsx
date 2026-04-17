import { useEffect, useState } from "react"
import { CurrentForecast } from "./components/CurrentForecast"
import { GraphPanel } from "./components/GraphPanel"
import { MapPanel } from "./components/MapPanel"
import { NextHourly } from "./components/NextHourly"
import { SearchPanel } from "./components/SearchPanel"
import { SettingsPanel } from "./components/SettingsPanel"
import { StatsPanel } from "./components/StatsPanel"

export function DashboardPage() {
    const [data, setData] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            console.log("fetching data")
            try {
                const response = await fetch("http://localhost:5001/api/WeatherForecast?locationId=102")
                const jsonData = await response.json()
                setData(jsonData)
                console.log("data: ", jsonData)
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }
        fetchData()
    }, [])

    return (
            <div className="grid h-full grid-cols-[29fr_33fr_38fr] grid-rows-[8fr_45fr_47fr] gap-5 ">
                {data?.items?.[0] && data?.meta && <CurrentForecast forecast={data.items[0]} meta={data.meta} />}
                <SearchPanel />
                <SettingsPanel />
                <NextHourly />
                <MapPanel />
                <StatsPanel />
                <GraphPanel />
            </div>
        )
}

import type { WeatherForecastItem } from "@/entities/weather/model/types";
import { CROATIA_TIME_ZONE } from "./format-date";
import { parseForecastDate } from "./parse-forecast-date";

type DailyForecast = {
    date: string,
    averageTemperature: number,
    maxTemperature: number,
    minTemperature: number,
    cloudiness: number,
    humidity: number,
    precipitation: number,
    pressure: number,
    windSpeed: number,
    weatherSymbol: string,
}

function getMostFrequentValue(values: string[]) {
    const counts = new Map<string, number>()

    values.forEach(value => {
        counts.set(value, (counts.get(value) ?? 0) + 1)
    })

    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
}

// u slucajevima da nemamo nista kojii nisu nocni
// onda te nocne pretovirmo u dnevne
// ako nema night onda se samo zanemari 
function normalizeToDaySymbol(symbol: string) {
    return symbol.replace("_night", "_day")
}

function getDailyWeatherSymbol(dayItems: WeatherForecastItem[]) {
    const symbols = dayItems.map(item => item.weatherSymbol).filter(Boolean)
    const daytimeSymbols = symbols.filter(symbol => !symbol.includes("_night"))
    const mostFrequentDaytimeSymbol = getMostFrequentValue(daytimeSymbols)

    if (mostFrequentDaytimeSymbol) {
        return mostFrequentDaytimeSymbol
    }

    return normalizeToDaySymbol(getMostFrequentValue(symbols) ?? "clearsky_day")
}

//dobija forecast i iz njega izvlaci daily podatke
export const getForecastDaily = (forecasts: WeatherForecastItem[]) => {
    const groupedForecast = new Map<string, WeatherForecastItem[]>()
    // grupira forecasta po datumu
    forecasts.forEach(f => {
        const dateKey = parseForecastDate(f.forecastTime).toLocaleDateString("en-CA", {
            timeZone: CROATIA_TIME_ZONE,
        });
        if(groupedForecast.has(dateKey)) {
            groupedForecast.get(dateKey)?.push(f)
        } else {
            groupedForecast.set(dateKey, [f])
        }
        }
    );

    const dailyForecasts: DailyForecast[] = []
    // za svaki datum izracuna max i min temperaturu, te ostale podatke
    groupedForecast.forEach((dayItems, date) => {
        const maxTemperature = Math.max(...dayItems.map(f => f.airTemperature))
        const minTemperature = Math.min(...dayItems.map(f => f.airTemperature))
        const averageTemperature = Math.round((dayItems.reduce((sum, f) => sum + f.airTemperature, 0) / dayItems.length) * 10) / 10
        const cloudiness = Math.round(dayItems.reduce((sum, f) => sum + f.cloudiness, 0) / dayItems.length)
        const humidity = Math.round(dayItems.reduce((sum, f) => sum + f.humidity, 0) / dayItems.length)
        const precipitation = dayItems.reduce((sum, f) => sum + f.precipitationAmount, 0)
        const pressure = Math.round(dayItems.reduce((sum, f) => sum + f.airPressureAtSeaLevel, 0) / dayItems.length)
        const windSpeed = Math.round(dayItems.reduce((sum, f) => sum + f.windSpeed, 0) / dayItems.length)
        const weatherSymbol = getDailyWeatherSymbol(dayItems)

        dailyForecasts.push({
            date,
            averageTemperature,
            maxTemperature,
            minTemperature,
            cloudiness,
            humidity,
            precipitation,
            pressure,
            windSpeed,
            weatherSymbol,
        })
    })
    return dailyForecasts
};

import { WeatherSymbolIcon } from "@/entities/weather/ui/WeatherSymbolIcon";
import { Star, Trash2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import type { Location } from "@/entities/location/types";

type SettingsFavoriteLocationsBlockProps = {
  favoriteLocations: Location[]
  removeFavoriteLocation: (locationId: number) => void
}

export function SettingsFavoriteLocationsBlock({
  favoriteLocations,
  removeFavoriteLocation,
}: SettingsFavoriteLocationsBlockProps) {
  return (
    <div className="flex min-h-0 flex-1 pt-2 flex-col gap-2 overflow-y-auto pr-1">
      {favoriteLocations.length ? (
        favoriteLocations.map((location) => (
          <NavLink
            key={location.id}
            to={`/${location.id}`}
            className="group relative flex items-center justify-between gap-4 overflow-visible rounded-[22px] border border-white/10 bg-[#2b2f36]/70 px-4 py-2 text-left shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.03)] backdrop-blur-xl transition duration-200 ease-out hover:-translate-y-0.5 hover:border-white/15 hover:bg-[#303640]/75"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Star
                size={22}
                className="fill-accent-secondary text-accent-secondary"
              />

              <div className="min-w-0">
                <p className="line-clamp-1 text-[18px] font-semibold">
                  {location.name}
                </p>
                <div className="mt-1 space-y-0.5 text-[10px] gap-2 font-light flex leading-tight text-white/45">
                  <p>Latatitude: {location.latitude}</p>
                  <p>Longitude: {location.longitude}</p>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              {location.currentWeather?.weatherSymbol ? (
                <WeatherSymbolIcon
                  symbol={location.currentWeather.weatherSymbol}
                  className="w-10 drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)]"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-white/7" />
              )}
              <p className="font-semibold text-[18px] bg-linear-to-r from-accent-secondary to-accent-primary bg-clip-text text-transparent">
                {location.currentWeather?.airTemperature ?? "--"}
              </p>
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  void removeFavoriteLocation(location.id);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:white/20"
                aria-label="Remove favorite location"
              >
                <Trash2 size={17} />
              </button>
            </div>
          </NavLink>
        ))
      ) : (
        <div className="flex min-h-26 flex-1 items-center justify-center p-4">
          <p className="text-center text-[16px] font-extralight text-subtext">
            No favorite locations yet.
          </p>
        </div>
      )}
    </div>
  );
}

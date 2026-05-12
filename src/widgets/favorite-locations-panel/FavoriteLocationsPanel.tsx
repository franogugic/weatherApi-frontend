import { useFavoriteLocationStore } from "@/features/favorite-locations/favorite-locations-store";
import { NavLink } from "react-router-dom";
import { SettingsFavoriteLocationsBlock } from "@/shared/ui/settings/SettingsFavoriteLocationsBlock";

export function FavoriteLocationsWidgetPanel() {
  const favoriteLocations = useFavoriteLocationStore(
    (state) => state.favoriteLocations,
  );
  const removeFavoriteLocation = useFavoriteLocationStore(
    (state) => state.removeFavoriteLocation,
  );

  return (
    <div className="flex h-full min-h-0 flex-col rounded-4xl bg-div p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[22px] font-semibold">Favorite Locations</p>
        <NavLink
          to={"/settings"}
          className="cursor-pointer rounded-2xl border-[1px] border-accent-primary px-4 py-1 bg-linear-to-r from-accent-secondary to-accent-primary bg-clip-text text-transparent"
        >
          Add new locations
        </NavLink>
      </div>

      <SettingsFavoriteLocationsBlock favoriteLocations={favoriteLocations} removeFavoriteLocation={removeFavoriteLocation}/>
    </div>
  );
}
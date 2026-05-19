import { useFavoriteLocationStore } from "@/features/favorite-locations/favorite-locations-store";
import { NavLink } from "react-router-dom";
import { SettingsFavoriteLocationsBlock } from "@/shared/ui/settings/SettingsFavoriteLocationsBlock";
import { useTranslation } from "react-i18next";

export function FavoriteLocationsWidgetPanel() {
  const { t } = useTranslation()
  const favoriteLocations = useFavoriteLocationStore(
    (state) => state.favoriteLocations,
  );
  const removeFavoriteLocation = useFavoriteLocationStore(
    (state) => state.removeFavoriteLocation,
  );

  return (
    <div className="flex h-full min-h-0 flex-col rounded-[28px] bg-div p-4 sm:p-6 lg:rounded-4xl">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xl font-semibold sm:text-[22px]">{t("favorites.title")}</p>
        <NavLink
          to={"/settings"}
          className="cursor-pointer rounded-2xl border-[1px] border-accent-primary px-4 py-1 text-center bg-linear-to-r from-accent-secondary to-accent-primary bg-clip-text text-transparent"
        >
          {t("favorites.addNew")}
        </NavLink>
      </div>

      <SettingsFavoriteLocationsBlock favoriteLocations={favoriteLocations} removeFavoriteLocation={removeFavoriteLocation}/>
    </div>
  );
}

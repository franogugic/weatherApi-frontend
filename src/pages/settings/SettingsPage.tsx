import { useAuthStore } from "@/features/auth/auth-store";
import { useDashboardLayoutStore } from "@/features/dashboard-layout/dashboard-layout-store";
import { useFavoriteLocationStore } from "@/features/favorite-locations/favorite-locations-store";
import { LANGUAGE_OPTIONS } from "@/features/language/language-options";
import { useLanguageStore } from "@/features/language/language-store";
import { LAST_VIEWED_LOCATION_ID_KEY } from "@/features/location/last-viewed-location";
import { useLocationStore } from "@/features/location/location-store";
import { useUnitPreferenceStore } from "@/features/unit-preferences/unit-preference-store";

import type { UnitPreferences } from "@/features/unit-preferences/unit-preferences-types";
import { AppDropdown } from "@/shared/ui/dropdown/AppDropdown";
import { LinearText } from "@/shared/ui/linear-text/LinearText";
import { SettingsFavoriteLocationsBlock } from "@/shared/ui/settings/SettingsFavoriteLocationsBlock";
import { SettingsLanguageBlock } from "@/shared/ui/settings/SettingsLanguageBlock";
import { SettingsPersonalInfoBlock } from "@/shared/ui/settings/SettingsPersonalInfoBlock";
import { SettingsUnitsBlock } from "@/shared/ui/settings/SettingUnitsBlock";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";

export function SettingsPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isLoadingUser = useAuthStore((state) => state.isLoadingUser);
  const startDashboardEditing = useDashboardLayoutStore(
    (state) => state.startDashboardEditing,
  );
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  const favoriteLocations = useFavoriteLocationStore(
    (state) => state.favoriteLocations,
  );
  const removeFavoriteLocation = useFavoriteLocationStore(
    (state) => state.removeFavoriteLocation,
  );
  const addFavoriteLocation = useFavoriteLocationStore(
    (state) => state.addFavoriteLocation,
  );
  const locations = useLocationStore((state) => state.locations);

  const selectedLanguage =
    LANGUAGE_OPTIONS.find((option) => option.value === language) ??
    LANGUAGE_OPTIONS[0];

  const possibleLocations = locations.filter(
    (location) =>
      !favoriteLocations.some((favorite) => favorite.id === location.id),
  );

  const hasLoadedCurrentUser = useAuthStore(
    (state) => state.hasLoadedCurrentUser,
  );

  const preferences = useUnitPreferenceStore((state) => state.preferences);

  const updatePreferences = useUnitPreferenceStore(
    (state) => state.updatePreferences,
  );

  const [preferenceErrorMessage, setPreferenceErrorMessage] = useState("");

  async function handlePreferenceChange<K extends keyof UnitPreferences>(
    key: K,
    value: UnitPreferences[K],
  ) {
    setPreferenceErrorMessage("");

    try {
      await updatePreferences({
        ...preferences,
        [key]: value,
      });
    } catch (error) {
      console.error(error);

      setPreferenceErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not update preferences.",
      );
    }
  }

  function handleEditHomeLayout() {
    startDashboardEditing();

    const lastViewedLocationId = localStorage.getItem(
      LAST_VIEWED_LOCATION_ID_KEY,
    );

    navigate(lastViewedLocationId ? `/${lastViewedLocationId}` : "/");
  }

  if (isLoadingUser || !hasLoadedCurrentUser) {
    return (
      <div className="rounded-4xl bg-div p-6">
        <p className="text-subtext">Loading settings...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center rounded-4xl bg-div p-6">
        <div className="max-w-md text-center">
          <h1 className="mb-2 text-3xl font-semibold">Settings</h1>

          <p className="mb-6 text-sm text-subtext">
            Login to customize measurement units.
          </p>

          <div className="flex justify-center gap-3">
            <Link
              to="/login"
              className="rounded-2xl border border-white/10 px-5 py-2 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:text-white"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-2xl bg-linear-to-b from-accent-secondary to-accent-primary px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="flex h-full min-h-0 flex-col overflow-hidden rounded-4xl bg-div p-6 text-white">
      <div className="mb-4 flex h-10 items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2 lg:grid-rows-[100px_150px_minmax(0,1fr)_150px_60px]">
        <div className="col-span-2 flex items-center justify-between gap-4 rounded-4xl border-white/10 bg-[#2b2f36]/70 px-8 p-4 shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.03)] hover:border-white/15 hover:bg-[#303640]/75">
          <div>
            <p className="flex text-[40px] font-semibold">
              Welcome back,&nbsp;
              <LinearText text={user.firstName} />!
            </p>
            <p className="text-[12px] text-white/60">
              Customize your experience and make the app truly yours.
            </p>
          </div>
          <button
            type="button"
            onClick={handleEditHomeLayout}
            className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-[#20252c]/90 px-4 py-3 text-[13px] font-semibold text-white/80 shadow-[0_14px_32px_rgba(0,0,0,0.32)] backdrop-blur-xl transition hover:text-white"
            aria-label="Edit home layout"
          >
            <Pencil size={16} />
            Edit layout
          </button>
        </div>

        <div className="rounded-4xl border-white/10 bg-[#2b2f36]/70 shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.03)] hover:border-white/15 hover:bg-[#303640]/75 p-4">
          <SettingsPersonalInfoBlock />
        </div>

        <div className="row-span-2 w-full min-w-0 rounded-4xl border-white/10 bg-[#2b2f36]/70 shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.03)] hover:border-white/15 hover:bg-[#303640]/75 p-4">
          <SettingsUnitsBlock
            preferences={preferences}
            handlePreferenceChange={handlePreferenceChange}
            preferenceErrorMessage={preferenceErrorMessage}
          />
        </div>

        <div className="row-span-2 rounded-4xl border-white/10 bg-[#2b2f36]/70 shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.03)] hover:border-white/15 hover:bg-[#303640]/75 p-4 min-w-0">
          <div className="mb-4 flex items-center justify-between gap-3">
            <LinearText
              text="Favorite locations"
              className="text-[20px] font-semibold"
            />
            <AppDropdown
              value=""
              placeholder="Add location"
              options={possibleLocations.map((location) => ({
                value: String(location.id),
                label: location.name,
                description: `${location.latitude.toFixed(2)} lat | ${location.longitude.toFixed(2)} lon`,
              }))}
              emptyMessage="No more locations to add."
              onChange={(value) => {
                void addFavoriteLocation(Number(value));
              }}
              className="w-44"
              buttonClassName="rounded-2xl px-3 py-1.5 text-[13px]"
              menuClassName="w-72"
              placement="auto"
            />
          </div>

          <SettingsFavoriteLocationsBlock
            favoriteLocations={favoriteLocations}
            removeFavoriteLocation={removeFavoriteLocation}
          />
        </div>

        <div className="rounded-4xl border-white/10 bg-[#2b2f36]/70 shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.03)] hover:border-white/15 hover:bg-[#303640]/75 p-4 min-w-0">
          <SettingsLanguageBlock
            selectedLanguage={selectedLanguage}
            dropdownPlacement="top"
            onSelectLanguage={(value) => {
              setLanguage(value);
            }}
          />
        </div>
      </div>
    </main>
  );
}

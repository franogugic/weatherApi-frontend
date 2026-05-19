import { useAdminLocationStore } from "@/features/admin-locations/admin-location-store";
import { useFavoriteLocationStore } from "@/features/favorite-locations/favorite-locations-store";
import { useLocationStore } from "@/features/location/location-store";
import { LinearText } from "@/shared/ui/linear-text/LinearText";
import {
  ChevronDown,
  ChevronRight,
  Loader2,
  MapPinPlus,
  Trash2,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

type LocationFormState = {
  name: string;
  latitude: string;
  longitude: string;
  altitude: string;
};

const INITIAL_FORM_STATE: LocationFormState = {
  name: "",
  latitude: "",
  longitude: "",
  altitude: "",
};

export function SettingsAdminLocationsBlock() {
  const { t } = useTranslation();
  const locations = useLocationStore((state) => state.locations);
  const createLocation = useAdminLocationStore((state) => state.createLocation);
  const deleteLocation = useAdminLocationStore((state) => state.deleteLocation);
  const expandedLocationId = useAdminLocationStore(
    (state) => state.expandedLocationId,
  );
  const setExpandedLocationId = useAdminLocationStore(
    (state) => state.setExpandedLocationId,
  );
  const fetchLogsByLocationId = useAdminLocationStore(
    (state) => state.fetchLogsByLocationId,
  );
  const isCreatingLocation = useAdminLocationStore(
    (state) => state.isCreatingLocation,
  );
  const deletingLocationId = useAdminLocationStore(
    (state) => state.deletingLocationId,
  );
  const loadingFetchLogsLocationId = useAdminLocationStore(
    (state) => state.loadingFetchLogsLocationId,
  );
  const deletingFetchId = useAdminLocationStore(
    (state) => state.deletingFetchId,
  );
  const toggleLocationFetchLogs = useAdminLocationStore(
    (state) => state.toggleLocationFetchLogs,
  );
  const loadLocationFetchLogs = useAdminLocationStore(
    (state) => state.loadLocationFetchLogs,
  );
  const deleteLocationFetch = useAdminLocationStore(
    (state) => state.deleteLocationFetch,
  );
  const loadFavoriteLocations = useFavoriteLocationStore(
    (state) => state.loadFavoriteLocations,
  );

  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const sortedLocations = [...locations].sort(
    (a, b) => a.name.localeCompare(b.name) || a.id - b.id,
  );

  function updateForm(key: keyof LocationFormState, value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    const latitude = Number(form.latitude);
    const longitude = Number(form.longitude);
    const altitude = form.altitude.trim() ? Number(form.altitude) : null;

    if (!form.name.trim() || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      setErrorMessage(t("settings.adminLocations.invalidForm"));
      return;
    }

    if (altitude !== null && !Number.isFinite(altitude)) {
      setErrorMessage(t("settings.adminLocations.invalidForm"));
      return;
    }

    try {
      await createLocation({
        name: form.name.trim(),
        latitude,
        longitude,
        altitude,
      });

      setForm(INITIAL_FORM_STATE);
      setMessage(t("settings.adminLocations.createSuccess"));
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : t("settings.adminLocations.createFailed"),
      );
    }
  }

  async function handleToggleFetchLogs(locationId: number) {
    setErrorMessage("");

    try {
      await toggleLocationFetchLogs(locationId);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : t("settings.adminLocations.fetchLogsFailed"),
      );
    }
  }

  async function handleDeleteLocation(locationId: number) {
    setMessage("");
    setErrorMessage("");

    try {
      await deleteLocation(locationId);
      await loadFavoriteLocations();
      setMessage(t("settings.adminLocations.deleteSuccess"));
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : t("settings.adminLocations.deleteFailed"),
      );
    }
  }

  async function handleDeleteFetch(locationId: number, fetchId: number) {
    setMessage("");
    setErrorMessage("");

    try {
      await deleteLocationFetch(locationId, fetchId);
      setMessage(t("settings.adminLocations.deleteFetchSuccess"));
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : t("settings.adminLocations.deleteFetchFailed"),
      );
    }
  }

  async function handleRefreshFetchLogs(locationId: number) {
    setErrorMessage("");
    setExpandedLocationId(locationId);

    try {
      await loadLocationFetchLogs(locationId);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : t("settings.adminLocations.fetchLogsFailed"),
      );
    }
  }

  function formatDateTime(value: string | null) {
    if (!value) {
      return "--";
    }

    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  }

  function getStatusClassName(statusCode: number | null) {
    if (statusCode === 200) {
      return "border-emerald-400/20 bg-emerald-500/10 text-emerald-200";
    }

    if (statusCode === null) {
      return "border-white/10 bg-white/5 text-white/45";
    }

    return "border-red-400/20 bg-red-500/10 text-red-200";
  }

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center justify-between gap-3">
        <LinearText
          text={t("settings.adminLocations.title")}
          className="text-[20px] font-semibold"
        />
        <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">
          {t("settings.adminLocations.badge")}
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-2 rounded-[22px] border border-white/10 bg-[#20252c]/55 p-3 shadow-[0_4px_12px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.03)] sm:grid-cols-2 xl:grid-cols-[minmax(160px,1.4fr)_repeat(3,minmax(92px,0.8fr))_auto]"
      >
        <input
          value={form.name}
          onChange={(event) => updateForm("name", event.target.value)}
          placeholder={t("settings.adminLocations.name")}
          className="min-w-0 rounded-2xl border border-white/10 bg-[#171b20]/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-accent-secondary/60"
        />
        <input
          value={form.latitude}
          onChange={(event) => updateForm("latitude", event.target.value)}
          placeholder={t("settings.adminLocations.latitude")}
          inputMode="decimal"
          className="min-w-0 rounded-2xl border border-white/10 bg-[#171b20]/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-accent-secondary/60"
        />
        <input
          value={form.longitude}
          onChange={(event) => updateForm("longitude", event.target.value)}
          placeholder={t("settings.adminLocations.longitude")}
          inputMode="decimal"
          className="min-w-0 rounded-2xl border border-white/10 bg-[#171b20]/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-accent-secondary/60"
        />
        <input
          value={form.altitude}
          onChange={(event) => updateForm("altitude", event.target.value)}
          placeholder={t("settings.adminLocations.altitude")}
          inputMode="numeric"
          className="min-w-0 rounded-2xl border border-white/10 bg-[#171b20]/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-accent-secondary/60"
        />
        <button
          type="submit"
          disabled={isCreatingLocation}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-linear-to-b from-accent-secondary to-accent-primary px-4 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2 xl:col-span-1"
        >
          {isCreatingLocation ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <MapPinPlus size={16} />
          )}
          <span>{t("settings.adminLocations.add")}</span>
        </button>
      </form>

      {errorMessage ? (
        <p className="mt-3 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          {errorMessage}
        </p>
      ) : null}

      {message ? (
        <p className="mt-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
          {message}
        </p>
      ) : null}

      <div className="mt-4 flex flex-col gap-2 pr-1">
        {sortedLocations.map((location) => (
          <div
            key={location.id}
            className="rounded-[22px] border border-white/10 bg-[#2b2f36]/70 px-4 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.03)] transition duration-200 ease-out hover:border-white/15 hover:bg-[#303640]/75"
          >
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
              <button
                type="button"
                onClick={() => {
                  void handleToggleFetchLogs(location.id);
                }}
                className="group flex min-w-0 items-center gap-3 text-left"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/60 transition group-hover:text-white">
                  {expandedLocationId === location.id ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-white">
                    {location.name}
                  </span>
                  <span className="mt-1 block truncate text-[12px] text-white/45">
                    {location.latitude.toFixed(6)} lat |{" "}
                    {location.longitude.toFixed(6)} lon |{" "}
                    {location.altitude ?? "--"} m
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  void handleRefreshFetchLogs(location.id);
                }}
                disabled={loadingFetchLogsLocationId === location.id}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-white/10 px-3 text-[12px] font-semibold text-white/65 transition hover:bg-white/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingFetchLogsLocationId === location.id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : null}
                {t("settings.adminLocations.refreshFetches")}
              </button>
              <button
                type="button"
                onClick={() => {
                  void handleDeleteLocation(location.id);
                }}
                disabled={deletingLocationId === location.id}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-red-500/18 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label={t("settings.adminLocations.delete")}
              >
                {deletingLocationId === location.id ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Trash2 size={15} />
                )}
              </button>
            </div>

            {expandedLocationId === location.id ? (
              <div className="mt-3 border-t border-white/8 pt-3">
                {loadingFetchLogsLocationId === location.id ? (
                  <div className="flex items-center gap-2 rounded-2xl bg-[#20252c]/70 px-4 py-4 text-sm text-white/55">
                    <Loader2 size={15} className="animate-spin" />
                    {t("settings.adminLocations.loadingFetches")}
                  </div>
                ) : (fetchLogsByLocationId[location.id] ?? []).length ? (
                  <div className="grid gap-2">
                    {(fetchLogsByLocationId[location.id] ?? []).map(
                      (fetchLog) => (
                        <div
                          key={fetchLog.fetchId}
                          className="rounded-2xl border border-white/8 bg-[#20252c]/70 p-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-[13px] font-semibold text-white">
                                  #{fetchLog.fetchId}
                                </p>
                                <span
                                  className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${getStatusClassName(
                                    fetchLog.statusCode,
                                  )}`}
                                >
                                  {fetchLog.statusCode ?? "--"}
                                </span>
                                <span className="rounded-full bg-white/7 px-2 py-0.5 text-[11px] font-semibold text-white/45">
                                  {fetchLog.responseType || "--"}
                                </span>
                                <span className="rounded-full bg-white/7 px-2 py-0.5 text-[11px] font-semibold text-white/45">
                                  {fetchLog.hourlyForecastCount}{" "}
                                  {t("settings.adminLocations.items")}
                                </span>
                              </div>
                              <div className="mt-2 grid gap-1 text-[11px] text-white/45 sm:grid-cols-2">
                                <p>
                                  {t("settings.adminLocations.fetchedAt")}:{" "}
                                  <span className="text-white/65">
                                    {formatDateTime(fetchLog.fetchedAt)}
                                  </span>
                                </p>
                                <p>
                                  {t("settings.adminLocations.updatedAt")}:{" "}
                                  <span className="text-white/65">
                                    {formatDateTime(fetchLog.updatedAt)}
                                  </span>
                                </p>
                              </div>
                              {fetchLog.errorMessage ? (
                                <p className="mt-2 line-clamp-2 rounded-xl border border-red-400/12 bg-red-500/8 px-3 py-2 text-[11px] text-red-100/80">
                                  {fetchLog.errorMessage}
                                </p>
                              ) : null}
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                void handleDeleteFetch(
                                  location.id,
                                  fetchLog.fetchId,
                                );
                              }}
                              disabled={deletingFetchId === fetchLog.fetchId}
                              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-red-500/18 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-60"
                              aria-label={t(
                                "settings.adminLocations.deleteFetch",
                              )}
                            >
                              {deletingFetchId === fetchLog.fetchId ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Trash2 size={14} />
                              )}
                            </button>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <div className="rounded-2xl bg-[#20252c]/70 px-4 py-4 text-sm text-white/45">
                    {t("settings.adminLocations.noFetches")}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

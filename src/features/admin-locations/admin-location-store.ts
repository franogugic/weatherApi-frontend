import type { Location } from "@/entities/location/types";
import { create } from "zustand";
import { getAuthErrorMessage } from "../auth/auth-error";
import { useLocationStore } from "../location/location-store";
import { LAST_VIEWED_LOCATION_ID_KEY } from "../location/last-viewed-location";
import type { CreateLocationRequest, LocationFetchLog } from "./admin-location-types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type AdminLocationStore = {
  expandedLocationId: number | null;
  fetchLogsByLocationId: Record<number, LocationFetchLog[]>;
  isCreatingLocation: boolean;
  deletingLocationId: number | null;
  loadingFetchLogsLocationId: number | null;
  deletingFetchId: number | null;
  setExpandedLocationId: (locationId: number | null) => void;
  createLocation: (request: CreateLocationRequest) => Promise<Location>;
  deleteLocation: (locationId: number) => Promise<void>;
  toggleLocationFetchLogs: (locationId: number) => Promise<void>;
  loadLocationFetchLogs: (locationId: number) => Promise<void>;
  deleteLocationFetch: (locationId: number, fetchId: number) => Promise<void>;
};

export const useAdminLocationStore = create<AdminLocationStore>((set, get) => ({
  expandedLocationId: null,
  fetchLogsByLocationId: {},
  isCreatingLocation: false,
  deletingLocationId: null,
  loadingFetchLogsLocationId: null,
  deletingFetchId: null,
  setExpandedLocationId: (locationId) => set({ expandedLocationId: locationId }),
  createLocation: async (request) => {
    set({ isCreatingLocation: true });

    try {
      const response = await fetch(`${API_BASE_URL}/admin/locations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorResponse = await response.json().catch(() => null);
        throw new Error(getAuthErrorMessage(errorResponse, "Could not create location."));
      }

      const createdLocation = await response.json() as Location;

      useLocationStore.setState((state) => ({
        locations: [...state.locations, createdLocation].sort((a, b) =>
          a.name.localeCompare(b.name) || a.id - b.id
        ),
      }));

      return createdLocation;
    } finally {
      set({ isCreatingLocation: false });
    }
  },
  deleteLocation: async (locationId) => {
    set({ deletingLocationId: locationId });

    try {
      const response = await fetch(`${API_BASE_URL}/admin/locations/${locationId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorResponse = await response.json().catch(() => null);
        throw new Error(getAuthErrorMessage(errorResponse, "Could not delete location."));
      }

      const selectedLocation = useLocationStore.getState().selectedLocation;
      const storedLocationId = localStorage.getItem(LAST_VIEWED_LOCATION_ID_KEY);

      useLocationStore.setState((state) => ({
        selectedLocation: selectedLocation?.id === locationId ? null : state.selectedLocation,
        locations: state.locations.filter((location) => location.id !== locationId),
      }));

      if (storedLocationId === String(locationId)) {
        localStorage.removeItem(LAST_VIEWED_LOCATION_ID_KEY);
      }

      set((state) => {
        const nextFetchLogs = { ...state.fetchLogsByLocationId };
        delete nextFetchLogs[locationId];

        return {
          expandedLocationId:
            state.expandedLocationId === locationId ? null : state.expandedLocationId,
          fetchLogsByLocationId: nextFetchLogs,
        };
      });
    } finally {
      set({ deletingLocationId: null });
    }
  },
  toggleLocationFetchLogs: async (locationId) => {
    const { expandedLocationId, fetchLogsByLocationId, loadLocationFetchLogs } = get();

    if (expandedLocationId === locationId) {
      set({ expandedLocationId: null });
      return;
    }

    set({ expandedLocationId: locationId });

    if (!fetchLogsByLocationId[locationId]) {
      await loadLocationFetchLogs(locationId);
    }
  },
  loadLocationFetchLogs: async (locationId) => {
    set({ loadingFetchLogsLocationId: locationId });

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/locations/${locationId}/fetches`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        const errorResponse = await response.json().catch(() => null);
        throw new Error(
          getAuthErrorMessage(errorResponse, "Could not load location fetches."),
        );
      }

      const fetchLogs = (await response.json()) as LocationFetchLog[];

      set((state) => ({
        fetchLogsByLocationId: {
          ...state.fetchLogsByLocationId,
          [locationId]: fetchLogs,
        },
      }));
    } finally {
      set({ loadingFetchLogsLocationId: null });
    }
  },
  deleteLocationFetch: async (locationId, fetchId) => {
    set({ deletingFetchId: fetchId });

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/locations/${locationId}/fetches/${fetchId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) {
        const errorResponse = await response.json().catch(() => null);
        throw new Error(getAuthErrorMessage(errorResponse, "Could not delete fetch."));
      }

      set((state) => ({
        fetchLogsByLocationId: {
          ...state.fetchLogsByLocationId,
          [locationId]: (state.fetchLogsByLocationId[locationId] ?? []).filter(
            (fetchLog) => fetchLog.fetchId !== fetchId,
          ),
        },
      }));
    } finally {
      set({ deletingFetchId: null });
    }
  },
}));

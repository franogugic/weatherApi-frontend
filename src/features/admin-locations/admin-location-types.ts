export type CreateLocationRequest = {
  name: string;
  latitude: number;
  longitude: number;
  altitude: number | null;
};

export type LocationFetchLog = {
  fetchId: number;
  locationId: number;
  responseType: string;
  updatedAt: string | null;
  fetchedAt: string;
  statusCode: number | null;
  errorMessage: string | null;
  hourlyForecastCount: number;
};

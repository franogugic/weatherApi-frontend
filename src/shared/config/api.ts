const PRODUCTION_API_BASE_URL = "https://weatherapi-a9zl.onrender.com/api";
const DEVELOPMENT_API_BASE_URL = "http://localhost:5001/api";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? DEVELOPMENT_API_BASE_URL : PRODUCTION_API_BASE_URL);

const AUTH_SESSION_TOKEN_KEY = "weather_session_token";

export const getAuthSessionToken = () => localStorage.getItem(AUTH_SESSION_TOKEN_KEY);

export const storeAuthSessionToken = (sessionToken?: string) => {
  if (!sessionToken) {
    return;
  }

  localStorage.setItem(AUTH_SESSION_TOKEN_KEY, sessionToken);
};

export const clearAuthSessionToken = () => {
  localStorage.removeItem(AUTH_SESSION_TOKEN_KEY);
};

export const getAuthHeaders = (): HeadersInit => {
  const sessionToken = getAuthSessionToken();

  return sessionToken
    ? { Authorization: `Bearer ${sessionToken}` }
    : {};
};

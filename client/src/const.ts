export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

const DEFAULT_GITHUB_PAGES_BACKEND_ORIGIN = "https://bgpaytrack-755cdzgc.manus.space";

export const getApiBaseUrl = () => {
  const configuredOrigin = (import.meta.env.VITE_CLOUD_BACKEND_ORIGIN as string | undefined)?.replace(/\/+$/, "");
  if (configuredOrigin) return configuredOrigin;

  if (typeof window !== "undefined" && window.location.hostname.endsWith("github.io")) {
    return DEFAULT_GITHUB_PAGES_BACKEND_ORIGIN;
  }

  return "";
};

// Generate login URL at runtime so redirect URI reflects the active API host.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const apiBaseUrl = getApiBaseUrl();
  const redirectUri = `${apiBaseUrl || window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};

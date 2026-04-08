const AUTH_ROUTES = new Set([
  "/login",
  "/signup",
  "/forgot-password",
  "/update-password",
]);

export function getSafeRedirectPath(
  value: string | null | undefined,
  fallback = "/"
) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
}

export function getPostAuthRedirectPath(
  value: string | null | undefined,
  fallback = "/"
) {
  const safePath = getSafeRedirectPath(value, fallback);
  const pathname = safePath.split("?")[0] ?? safePath;

  if (AUTH_ROUTES.has(pathname)) {
    return fallback;
  }

  return safePath;
}

export function buildAuthCallbackUrl(origin: string, next: string) {
  const callbackUrl = new URL("/auth/callback", origin);
  callbackUrl.searchParams.set("next", getSafeRedirectPath(next));
  return callbackUrl.toString();
}

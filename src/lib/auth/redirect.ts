const AUTH_ROUTES = new Set([
  "/login",
  "/signup",
  "/forgot-password",
  "/update-password",
]);

const DEFAULT_LOCAL_ORIGIN = "http://localhost:3001";

function normalizeOrigin(value: string) {
  let origin = value.trim();

  if (!origin) {
    return DEFAULT_LOCAL_ORIGIN;
  }

  if (!origin.startsWith("http://") && !origin.startsWith("https://")) {
    origin = origin.includes("localhost") || origin.startsWith("127.0.0.1")
      ? `http://${origin}`
      : `https://${origin}`;
  }

  return origin.replace(/\/+$/, "");
}

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

export function getSiteOrigin(preferredOrigin?: string | null) {
  if (preferredOrigin) {
    return normalizeOrigin(preferredOrigin);
  }

  if (typeof window !== "undefined" && window.location.origin) {
    return normalizeOrigin(window.location.origin);
  }

  return normalizeOrigin(
    process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.NEXT_PUBLIC_VERCEL_URL ??
      process.env.VERCEL_URL ??
      DEFAULT_LOCAL_ORIGIN
  );
}

export function buildAbsoluteUrl(
  pathname: string,
  preferredOrigin?: string | null
) {
  const safePathname = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return new URL(safePathname, `${getSiteOrigin(preferredOrigin)}/`).toString();
}

export function buildAuthCallbackUrl(
  next: string,
  preferredOrigin?: string | null
) {
  const callbackUrl = new URL(
    "/auth/callback",
    `${getSiteOrigin(preferredOrigin)}/`
  );
  callbackUrl.searchParams.set("next", getSafeRedirectPath(next));
  return callbackUrl.toString();
}

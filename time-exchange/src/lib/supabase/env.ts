const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

function requireEnvVar(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getSupabaseUrl() {
  return requireEnvVar(supabaseUrl, "NEXT_PUBLIC_SUPABASE_URL");
}

export function getSupabasePublishableKey() {
  return requireEnvVar(
    supabasePublishableKey,
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY"
  );
}

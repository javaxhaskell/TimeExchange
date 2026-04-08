import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function SupabaseTestPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, full_name, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const isConnected = !error;

  return (
    <main className="min-h-screen bg-background px-6 py-12 text-foreground">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Supabase Integration
          </p>
          <h1 className="text-3xl font-semibold tracking-[-0.04em]">
            TimeExchange Supabase Test
          </h1>
          <p className="text-sm text-muted-foreground">
            This route uses the server-side Supabase client and queries{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">public.profiles</code>.
          </p>
        </header>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Connection status</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {isConnected
                  ? "Supabase responded successfully."
                  : "Supabase request failed."}
              </p>
            </div>
            <div
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                isConnected
                  ? "bg-emerald-500/12 text-emerald-400"
                  : "bg-destructive/12 text-destructive"
              }`}
            >
              {isConnected ? "Connected" : "Error"}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm font-medium">Query result</p>
          {error ? (
            <div className="mt-3 rounded-xl border border-destructive/20 bg-destructive/8 p-4 text-sm text-destructive">
              <p className="font-medium">Query failed</p>
              <p className="mt-1 break-words">{error.message}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                If you have not created the starter table yet, run the SQL in{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-foreground">
                  supabase/migrations/202604080001_create_profiles.sql
                </code>
                .
              </p>
            </div>
          ) : data.length === 0 ? (
            <div className="mt-3 rounded-xl border border-border bg-muted/35 p-4 text-sm text-muted-foreground">
              Connected successfully. The table exists but currently has no rows.
            </div>
          ) : (
            <div className="mt-3 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/45 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Username</th>
                    <th className="px-4 py-3 font-medium">Full name</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((profile) => (
                    <tr key={profile.id} className="border-t border-border">
                      <td className="px-4 py-3">{profile.username ?? "—"}</td>
                      <td className="px-4 py-3">{profile.full_name ?? "—"}</td>
                      <td className="px-4 py-3">
                        {profile.created_at
                          ? new Date(profile.created_at).toLocaleString("en-GB")
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

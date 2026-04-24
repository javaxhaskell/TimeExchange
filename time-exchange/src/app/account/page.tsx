import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function signOut() {
  "use server";

  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/account");
  }

  const providerValues = [
    ...(Array.isArray(user.app_metadata?.providers)
      ? user.app_metadata.providers
      : []),
    ...((user.identities ?? []).map((identity) => identity.provider).filter(
      (provider): provider is string => typeof provider === "string"
    )),
  ];
  const providers = Array.from(new Set(providerValues));
  const fullName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : null;
  const role =
    typeof user.user_metadata?.role === "string" ? user.user_metadata.role : null;

  return (
    <main className="min-h-screen bg-background px-6 py-12 text-foreground">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Account
          </p>
          <h1 className="text-3xl font-semibold tracking-[-0.04em]">
            Your TimeExchange profile
          </h1>
          <p className="text-sm text-muted-foreground">
            This page is backed by your real Supabase session.
          </p>
        </header>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <dl className="grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Full name
              </dt>
              <dd className="mt-2 text-base font-medium text-foreground">
                {fullName ?? "Not set"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Email
              </dt>
              <dd className="mt-2 text-base font-medium text-foreground">
                {user.email ?? "Unavailable"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Role
              </dt>
              <dd className="mt-2 text-base font-medium text-foreground">
                {role ?? "Not set"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Email status
              </dt>
              <dd className="mt-2 text-base font-medium text-foreground">
                {user.email_confirmed_at ? "Confirmed" : "Pending confirmation"}
              </dd>
            </div>
          </dl>

          <div className="mt-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Connected providers
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {providers.length > 0 ? (
                providers.map((provider) => (
                  <span
                    key={provider}
                    className="rounded-full border border-border bg-muted/45 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-foreground"
                  >
                    {provider}
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">
                  No linked providers found.
                </span>
              )}
            </div>
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/terminal"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted/45"
          >
            Back to terminal
          </Link>
          <Link
            href="/discover"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted/45"
          >
            Open discovery
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

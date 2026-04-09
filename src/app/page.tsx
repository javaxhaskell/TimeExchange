import { redirect } from "next/navigation";
import { GlobalMentorshipInterface } from "@/components/global-mentorship/GlobalMentorshipInterface";
import { AuthenticatedHomeRedirect } from "@/components/auth/AuthenticatedHomeRedirect";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function getSearchParam(
  value: string | string[] | undefined
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const code = getSearchParam(params.code);
  const tokenHash = getSearchParam(params.token_hash);

  if (code || tokenHash) {
    const callbackParams = new URLSearchParams();

    const type = getSearchParam(params.type);
    const next = getSearchParam(params.next);
    const error = getSearchParam(params.error);
    const errorDescription = getSearchParam(params.error_description);

    if (code) {
      callbackParams.set("code", code);
    }

    if (tokenHash) {
      callbackParams.set("token_hash", tokenHash);
    }

    if (type) {
      callbackParams.set("type", type);
    }

    if (next) {
      callbackParams.set("next", next);
    }

    if (error) {
      callbackParams.set("error", error);
    }

    if (errorDescription) {
      callbackParams.set("error_description", errorDescription);
    }

    redirect(`/auth/callback?${callbackParams.toString()}`);
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/terminal");
  }

  return (
    <>
      <AuthenticatedHomeRedirect />
      <GlobalMentorshipInterface />
    </>
  );
}

import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { getPostAuthRedirectPath } from "@/lib/auth/redirect";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const defaultNext = type === "recovery" ? "/update-password" : "/terminal";
  const next = getPostAuthRedirectPath(searchParams.get("next"), defaultNext);
  const supabase = await createSupabaseServerClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });

    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  // If something went wrong, redirect to login with error
  const loginUrl = new URL("/login", origin);
  loginUrl.searchParams.set("error", "auth_callback_failed");
  loginUrl.searchParams.set("redirect", next);

  return NextResponse.redirect(loginUrl);
}

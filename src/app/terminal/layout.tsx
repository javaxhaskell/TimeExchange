import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { TerminalShell } from "@/components/terminal/TerminalShell";

export const dynamic = "force-dynamic";

export default async function TerminalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/terminal");
  }

  const fullName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : null;

  return (
    <TerminalShell
      userEmail={user.email ?? ""}
      userName={fullName}
    >
      {children}
    </TerminalShell>
  );
}

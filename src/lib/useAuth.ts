"use client";

import { useEffect, useState } from "react";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    async function init() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    }
    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}

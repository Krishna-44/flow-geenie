import { createClient } from "@supabase/supabase-js";

export function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || (!serviceKey && !anon)) return null;
  return createClient(url, serviceKey ?? anon ?? "", { auth: { persistSession: false } });
}


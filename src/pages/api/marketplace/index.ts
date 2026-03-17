import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || (!serviceKey && !anon)) {
    return null;
  }

  // Prefer service role key for server-side API routes.
  return createClient(url, serviceKey ?? anon ?? "");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return res.status(500).json({ error: "Supabase not configured" });
  }

  const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
  const category = typeof req.query.category === "string" ? req.query.category.trim() : "";

  let query = supabase
    .from("marketplace_workflows")
    .select("id, title, description, category, installs, rating, created_at")
    .order("installs", { ascending: false });

  if (category && category !== "All") {
    query = query.eq("category", category);
  }

  if (search) {
    // Search title/description (simple ilike for now)
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ items: data ?? [] });
}


import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSupabase } from "@/services/database/serverSupabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const supabase = getServerSupabase();
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });

  const { data, error } = await supabase
    .from("templates")
    .select("id, name, description, category, template_json")
    .order("name", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ templates: data ?? [] });
}


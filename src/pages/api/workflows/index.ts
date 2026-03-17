import type { NextApiRequest, NextApiResponse } from "next";
import { requireUser } from "@/services/database/serverAuth";
import { getServerSupabase } from "@/services/database/serverSupabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = getServerSupabase();
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });

  try {
    const { userId } = await requireUser(req);

    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("workflows")
        .select("id, user_id, name, description, workflow_json, status, created_at, updated_at")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ workflows: data ?? [] });
    }

    if (req.method === "POST") {
      const body = req.body as Partial<{
        name: string;
        description: string;
        workflow_json: unknown;
        status: "active" | "inactive";
      }>;

      if (!body.name || !body.workflow_json) {
        return res.status(400).json({ error: "Missing name or workflow_json" });
      }

      const { data, error } = await supabase
        .from("workflows")
        .insert({
          user_id: userId,
          name: body.name,
          description: body.description ?? null,
          workflow_json: body.workflow_json,
          status: body.status ?? "inactive",
        })
        .select("id")
        .single();

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ id: data.id });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    if (msg === "UNAUTHENTICATED") return res.status(401).json({ error: "Unauthenticated" });
    if (msg === "SUPABASE_NOT_CONFIGURED") return res.status(500).json({ error: "Supabase not configured" });
    return res.status(500).json({ error: msg });
  }
}


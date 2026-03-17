import type { NextApiRequest, NextApiResponse } from "next";
import { requireUser } from "@/services/database/serverAuth";
import { getServerSupabase } from "@/services/database/serverSupabase";

function getId(req: NextApiRequest) {
  const id = req.query.id;
  return typeof id === "string" ? id : null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = getServerSupabase();
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });

  const id = getId(req);
  if (!id) return res.status(400).json({ error: "Missing workflow id" });

  try {
    const { userId } = await requireUser(req);

    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("workflows")
        .select("id, user_id, name, description, workflow_json, status, created_at, updated_at")
        .eq("id", id)
        .eq("user_id", userId)
        .maybeSingle();

      if (error) return res.status(500).json({ error: error.message });
      if (!data) return res.status(404).json({ error: "Workflow not found" });
      return res.status(200).json({ workflow: data });
    }

    if (req.method === "PUT") {
      const body = req.body as Partial<{
        name: string;
        description: string | null;
        workflow_json: unknown;
        status: "active" | "inactive";
      }>;

      const updates: Record<string, unknown> = {};
      if (typeof body.name === "string") updates.name = body.name;
      if (typeof body.description === "string" || body.description === null) updates.description = body.description;
      if (typeof body.status === "string") updates.status = body.status;
      if (typeof body.workflow_json !== "undefined") updates.workflow_json = body.workflow_json;

      if (Object.keys(updates).length === 0) return res.status(400).json({ error: "No updates provided" });

      const { data, error } = await supabase
        .from("workflows")
        .update(updates)
        .eq("id", id)
        .eq("user_id", userId)
        .select("id")
        .maybeSingle();

      if (error) return res.status(500).json({ error: error.message });
      if (!data) return res.status(404).json({ error: "Workflow not found" });
      return res.status(200).json({ ok: true });
    }

    if (req.method === "DELETE") {
      const { data, error } = await supabase
        .from("workflows")
        .delete()
        .eq("id", id)
        .eq("user_id", userId)
        .select("id")
        .maybeSingle();

      if (error) return res.status(500).json({ error: error.message });
      if (!data) return res.status(404).json({ error: "Workflow not found" });
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET, PUT, DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    if (msg === "UNAUTHENTICATED") return res.status(401).json({ error: "Unauthenticated" });
    if (msg === "SUPABASE_NOT_CONFIGURED") return res.status(500).json({ error: "Supabase not configured" });
    return res.status(500).json({ error: msg });
  }
}


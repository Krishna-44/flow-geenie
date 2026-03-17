import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { mockTemplates } from "@/services/database/mockData";

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || (!serviceKey && !anon)) return null;
  return createClient(url, serviceKey ?? anon ?? "");
}

type Body = { template_id: string; user_id: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const supabase = getServerSupabase();
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });

  const body = req.body as Partial<Body>;
  if (!body.template_id || !body.user_id) {
    return res.status(400).json({ error: "Missing template_id or user_id" });
  }

  // Today: fallback to local mockTemplates if Templates table isn't wired yet.
  // Later: replace with a DB fetch (public.templates).
  const template = mockTemplates.find((t) => t.id === body.template_id);
  if (!template) return res.status(404).json({ error: "Template not found" });

  const inserted = await supabase
    .from("workflows")
    .insert({
      user_id: body.user_id,
      name: template.name,
      description: template.description,
      workflow_json: template.template_json,
      status: "inactive",
    })
    .select("id")
    .single();

  if (inserted.error) return res.status(500).json({ error: inserted.error.message });
  return res.status(200).json({ workflow_id: inserted.data.id });
}


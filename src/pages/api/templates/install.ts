import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { installTemplate } from "@/services/automation/installTemplate";

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

  try {
    const workflowId = await installTemplate(body.template_id, body.user_id);
    return res.status(200).json({ workflow_id: workflowId });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    if (msg.toLowerCase().includes("not found")) return res.status(404).json({ error: "Template not found" });
    return res.status(500).json({ error: msg });
  }
}


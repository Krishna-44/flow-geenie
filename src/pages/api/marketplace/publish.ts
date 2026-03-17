import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || (!serviceKey && !anon)) return null;
  return createClient(url, serviceKey ?? anon ?? "");
}

type PublishBody = {
  workflow_id: string;
  creator_id: string;
  title: string;
  description?: string;
  category: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const supabase = getServerSupabase();
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });

  const body = req.body as Partial<PublishBody>;
  if (!body.workflow_id || !body.creator_id || !body.title || !body.category) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Ensure workflow exists (basic guard)
  const workflowCheck = await supabase.from("workflows").select("id").eq("id", body.workflow_id).maybeSingle();
  if (workflowCheck.error) return res.status(500).json({ error: workflowCheck.error.message });
  if (!workflowCheck.data) return res.status(404).json({ error: "Workflow not found" });

  const { data, error } = await supabase
    .from("marketplace_workflows")
    .insert({
      workflow_id: body.workflow_id,
      creator_id: body.creator_id,
      title: body.title,
      description: body.description ?? null,
      category: body.category,
    })
    .select("id")
    .single();

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ id: data.id });
}


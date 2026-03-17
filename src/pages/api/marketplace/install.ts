import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || (!serviceKey && !anon)) return null;
  return createClient(url, serviceKey ?? anon ?? "");
}

type InstallBody = {
  marketplace_id: string;
  user_id: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const supabase = getServerSupabase();
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });

  const body = req.body as Partial<InstallBody>;
  if (!body.marketplace_id || !body.user_id) {
    return res.status(400).json({ error: "Missing marketplace_id or user_id" });
  }

  // 1) Get marketplace entry
  const mp = await supabase
    .from("marketplace_workflows")
    .select("id, workflow_id, title, description, installs")
    .eq("id", body.marketplace_id)
    .single();
  if (mp.error) return res.status(500).json({ error: mp.error.message });

  // 2) Get workflow JSON from referenced workflow
  const wf = await supabase.from("workflows").select("workflow_json").eq("id", mp.data.workflow_id).single();
  if (wf.error) return res.status(500).json({ error: wf.error.message });

  // 3) Clone workflow JSON into user's workflows
  const inserted = await supabase
    .from("workflows")
    .insert({
      user_id: body.user_id,
      name: mp.data.title,
      description: mp.data.description ?? null,
      workflow_json: wf.data.workflow_json,
      status: "inactive",
    })
    .select("id")
    .single();
  if (inserted.error) return res.status(500).json({ error: inserted.error.message });

  // 4) Increment installs
  await supabase.from("marketplace_workflows").update({ installs: (mp.data.installs ?? 0) + 1 }).eq("id", mp.data.id);

  return res.status(200).json({ workflow_id: inserted.data.id });
}


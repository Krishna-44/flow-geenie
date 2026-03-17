import type { NextApiRequest, NextApiResponse } from "next";
import { requireUser } from "@/services/database/serverAuth";
import { getServerSupabase } from "@/services/database/serverSupabase";
import { runWorkflow } from "@/services/automation/automationService";

function getId(req: NextApiRequest) {
  const id = req.query.id;
  return typeof id === "string" ? id : null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const supabase = getServerSupabase();
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });

  const id = getId(req);
  if (!id) return res.status(400).json({ error: "Missing workflow id" });

  try {
    const { userId } = await requireUser(req);

    // Verify user owns workflow before running
    const wf = await supabase.from("workflows").select("id").eq("id", id).eq("user_id", userId).maybeSingle();
    if (wf.error) return res.status(500).json({ error: wf.error.message });
    if (!wf.data) return res.status(404).json({ error: "Workflow not found" });

    const run = await runWorkflow(id);
    return res.status(200).json({ run });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    if (msg === "UNAUTHENTICATED") return res.status(401).json({ error: "Unauthenticated" });
    return res.status(500).json({ error: msg });
  }
}


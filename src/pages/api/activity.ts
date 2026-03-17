import type { NextApiRequest, NextApiResponse } from "next";
import { requireUser } from "@/services/database/serverAuth";
import { getServerSupabase } from "@/services/database/serverSupabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const supabase = getServerSupabase();
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });

  try {
    const { userId } = await requireUser(req);

    // Fetch workflows for name mapping
    const wfs = await supabase.from("workflows").select("id, name").eq("user_id", userId);
    if (wfs.error) return res.status(500).json({ error: wfs.error.message });
    const nameById = new Map((wfs.data ?? []).map((w) => [w.id as string, w.name as string]));

    // Fetch runs for workflows owned by the user
    const wfIds = (wfs.data ?? []).map((w) => w.id as string);
    if (wfIds.length === 0) return res.status(200).json({ runs: [] });

    const runs = await supabase
      .from("workflow_runs")
      .select("id, workflow_id, status, logs, started_at, finished_at")
      .in("workflow_id", wfIds)
      .order("started_at", { ascending: false })
      .limit(100);

    if (runs.error) return res.status(500).json({ error: runs.error.message });

    const normalized = (runs.data ?? []).map((r) => ({
      id: r.id as string,
      workflow_id: r.workflow_id as string,
      workflow_name: nameById.get(r.workflow_id as string) ?? "Unknown",
      status: r.status as "running" | "success" | "failed",
      logs: (r.logs as unknown) ?? [],
      started_at: r.started_at as string,
      finished_at: (r.finished_at as string | null) ?? null,
    }));

    return res.status(200).json({ runs: normalized });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    if (msg === "UNAUTHENTICATED") return res.status(401).json({ error: "Unauthenticated" });
    return res.status(500).json({ error: msg });
  }
}


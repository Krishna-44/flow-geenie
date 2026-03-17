import { WorkflowDefinition, WorkflowRun } from '@/types/workflow';
import { getServerSupabase } from "@/services/database/serverSupabase";

/**
 * Simulates workflow execution.
 * In production, this would convert workflow JSON to n8n format
 * and trigger execution via n8n API.
 */
export const executeWorkflow = async (workflow: WorkflowDefinition): Promise<WorkflowRun> => {
  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    id: crypto.randomUUID(),
    workflow_id: crypto.randomUUID(),
    status: Math.random() > 0.2 ? 'success' : 'failed',
    logs: {
      steps: workflow.steps.map(step => ({
        id: step.id,
        status: 'completed',
        duration_ms: Math.floor(Math.random() * 1000) + 200,
        output: `Executed ${step.provider}.${step.action}`,
      })),
    },
    started_at: new Date().toISOString(),
    finished_at: new Date().toISOString(),
  };
};

export type StepRunLog = { step: string; status: "success" | "failed" | "running" };

/**
 * Run a workflow by id and persist a WorkflowRuns record.
 *
 * Process:
 * 1) Fetch workflow from DB
 * 2) Iterate steps and simulate execution
 * 3) Store run with logs
 */
export async function runWorkflow(workflowId: string) {
  const supabase = getServerSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const startedAt = new Date().toISOString();

  const wf = await supabase
    .from("workflows")
    .select("id, workflow_json")
    .eq("id", workflowId)
    .single();

  if (wf.error) throw new Error(wf.error.message);
  const workflowJson = wf.data.workflow_json as WorkflowDefinition;
  if (!workflowJson?.steps || !Array.isArray(workflowJson.steps)) throw new Error("Invalid workflow_json");

  const logs: StepRunLog[] = [];
  let status: "success" | "failed" = "success";

  for (const step of workflowJson.steps) {
    const stepKey = `${step.provider}_${step.action}`;
    // Simulate per-step execution delay
    await new Promise((r) => setTimeout(r, 250));

    const ok = Math.random() > 0.1;
    logs.push({ step: stepKey, status: ok ? "success" : "failed" });
    if (!ok) {
      status = "failed";
      break;
    }
  }

  const finishedAt = new Date().toISOString();

  const inserted = await supabase
    .from("workflow_runs")
    .insert({
      workflow_id: workflowId,
      status,
      logs,
      started_at: startedAt,
      finished_at: finishedAt,
    })
    .select("id, status, logs, started_at, finished_at")
    .single();

  if (inserted.error) throw new Error(inserted.error.message);

  return inserted.data;
}

/**
 * Converts workflow JSON to n8n-compatible format (stub).
 */
export const convertToN8nFormat = (workflow: WorkflowDefinition) => {
  return {
    name: workflow.name,
    nodes: workflow.steps.map((step, i) => ({
      parameters: step.config,
      name: step.label,
      type: `n8n-nodes-base.${step.provider}`,
      position: [250 * i, 300],
    })),
    connections: {},
  };
};

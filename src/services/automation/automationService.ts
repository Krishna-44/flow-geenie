import { WorkflowDefinition, WorkflowRun } from '@/types/workflow';

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

export type StepType = 'trigger' | 'ai' | 'action';

export interface WorkflowStep {
  id: string;
  type: StepType;
  provider: string;
  action: string;
  label: string;
  description?: string;
  config: Record<string, unknown>;
}

export interface WorkflowDefinition {
  name: string;
  description?: string;
  steps: WorkflowStep[];
}

export interface Workflow {
  id: string;
  user_id: string;
  name: string;
  description: string;
  workflow_json: WorkflowDefinition;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface WorkflowRun {
  id: string;
  workflow_id: string;
  status: 'success' | 'failed' | 'running';
  logs: Record<string, unknown>;
  started_at: string;
  finished_at?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  template_json: WorkflowDefinition;
  category: string;
  /** Example use case explaining when/why to use this template */
  useCase?: string;
}

export type UserRow = {
  id: string;
  email: string;
  created_at: string;
};

export type WorkflowStatus = "active" | "inactive";

export type WorkflowRow = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  workflow_json: unknown;
  status: WorkflowStatus;
  created_at: string;
  updated_at: string;
};

export type WorkflowRunStatus = "running" | "success" | "failed";

export type WorkflowRunRow = {
  id: string;
  workflow_id: string;
  status: WorkflowRunStatus;
  logs: unknown;
  started_at: string;
  finished_at: string | null;
};

export type TemplateRow = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  template_json: unknown;
};


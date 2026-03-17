import type { ReactElement } from "react";
import type { NextPageWithLayout } from "../_app";
import { AppLayout } from "@/components/layout/AppLayout";
import { getWorkflowRuns, getWorkflows } from "@/services/database/mockData";
import { CheckCircle, Clock, XCircle } from "lucide-react";

const ActivityPage: NextPageWithLayout = () => {
  const runs = getWorkflowRuns();
  const workflows = getWorkflows();

  const getWorkflowName = (workflowId: string) => workflows.find((w) => w.id === workflowId)?.name || "Unknown";

  const statusIcons: Record<string, JSX.Element> = {
    success: <CheckCircle className="w-4 h-4 text-node-trigger" />,
    failed: <XCircle className="w-4 h-4 text-destructive" />,
    running: <Clock className="w-4 h-4 text-primary" />,
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Activity</h1>
        <p className="text-sm text-muted-foreground mt-1">Workflow execution history</p>
      </div>

      <div className="surface-card divide-y divide-border">
        {runs.map((run) => (
          <div key={run.id} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {statusIcons[run.status]}
              <div>
                <p className="text-sm font-medium text-foreground">{getWorkflowName(run.workflow_id)}</p>
                <p className="text-xs text-muted-foreground capitalize">{run.status}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-mono">{new Date(run.started_at).toLocaleString()}</p>
              {run.finished_at && (
                <p className="text-xs text-muted-foreground">
                  {((new Date(run.finished_at).getTime() - new Date(run.started_at).getTime()) / 1000).toFixed(1)}s
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

ActivityPage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;

export default ActivityPage;


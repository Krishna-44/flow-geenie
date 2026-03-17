import type { ReactElement } from "react";
import type { NextPageWithLayout } from "../_app";
import { AppLayout } from "@/components/layout/AppLayout";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { getRunsByWorkflowId, getWorkflowById } from "@/services/database/mockData";
import { WorkflowCanvas } from "@/components/workflow/WorkflowCanvas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, Trash2, CheckCircle, XCircle } from "lucide-react";

const WorkflowDetailPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [showJson, setShowJson] = useState(false);

  const workflowId = useMemo(() => {
    const id = router.query.id;
    return typeof id === "string" ? id : undefined;
  }, [router.query.id]);

  const workflow = workflowId ? getWorkflowById(workflowId) : undefined;
  const runs = workflowId ? getRunsByWorkflowId(workflowId) : [];

  if (!workflowId) {
    return <div className="p-8 text-sm text-muted-foreground">Loading…</div>;
  }

  if (!workflow) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Workflow not found.</p>
        <Button variant="ghost" onClick={() => router.push("/workflows")} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl">
      <button
        onClick={() => router.push("/workflows")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Workflows
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">{workflow.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{workflow.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={workflow.status === "active" ? "default" : "secondary"}
            className={workflow.status === "active" ? "gradient-primary text-primary-foreground border-0" : ""}
          >
            {workflow.status}
          </Badge>
          <Button variant="outline" size="sm" className="btn-press">
            {workflow.status === "active" ? (
              <>
                <Pause className="w-3.5 h-3.5 mr-1.5" /> Deactivate
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 mr-1.5" /> Activate
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" className="btn-press text-destructive hover:bg-destructive/10">
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <WorkflowCanvas workflow={workflow.workflow_json} />

      <div className="mt-6">
        <button onClick={() => setShowJson(!showJson)} className="text-xs font-medium text-primary hover:underline">
          {showJson ? "Hide" : "Show"} Workflow JSON
        </button>
        {showJson && (
          <pre className="mt-3 surface-card p-4 text-xs font-mono text-foreground overflow-auto max-h-64">
            {JSON.stringify(workflow.workflow_json, null, 2)}
          </pre>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold text-foreground mb-4">Activity History</h3>
        {runs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No runs yet.</p>
        ) : (
          <div className="surface-card divide-y divide-border">
            {runs.map((run) => (
              <div key={run.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  {run.status === "success" ? (
                    <CheckCircle className="w-4 h-4 text-node-trigger" />
                  ) : (
                    <XCircle className="w-4 h-4 text-destructive" />
                  )}
                  <span className="text-sm text-foreground capitalize">{run.status}</span>
                </div>
                <span className="text-xs text-muted-foreground font-mono">{new Date(run.started_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

WorkflowDetailPage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;

export default WorkflowDetailPage;


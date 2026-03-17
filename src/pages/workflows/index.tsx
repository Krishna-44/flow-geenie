import type { ReactElement } from "react";
import type { NextPageWithLayout } from "../_app";
import { AppLayout } from "@/components/layout/AppLayout";
import { getWorkflows } from "@/services/database/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Zap } from "lucide-react";
import { useRouter } from "next/router";

const WorkflowsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const workflows = getWorkflows();

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Workflows</h1>
          <p className="text-sm text-muted-foreground mt-1">{workflows.length} automations</p>
        </div>
        <Button onClick={() => router.push("/workflows/create")} className="gradient-primary text-primary-foreground btn-press">
          <Plus className="w-4 h-4 mr-2" /> New Workflow
        </Button>
      </div>

      <div className="grid gap-4">
        {workflows.map((w) => (
          <button
            key={w.id}
            onClick={() => router.push(`/workflows/${w.id}`)}
            className="surface-card p-5 flex items-center gap-4 hover:shadow-md transition-shadow text-left w-full"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-sm">{w.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{w.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">{w.workflow_json.steps.length} steps</span>
              <Badge
                variant={w.status === "active" ? "default" : "secondary"}
                className={w.status === "active" ? "gradient-primary text-primary-foreground border-0" : ""}
              >
                {w.status}
              </Badge>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

WorkflowsPage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;

export default WorkflowsPage;


import type { ReactElement } from "react";
import type { NextPageWithLayout } from "../_app";
import { AppLayout } from "@/components/layout/AppLayout";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Clock, XCircle } from "lucide-react";

const ActivityPage: NextPageWithLayout = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["activity"],
    queryFn: async (): Promise<{
      runs: Array<{
        id: string;
        workflow_id: string;
        workflow_name: string;
        status: "running" | "success" | "failed";
        logs: Array<{ step: string; status: string }>;
        started_at: string;
        finished_at: string | null;
      }>;
    }> => {
      const res = await fetch("/api/activity", { headers: { "x-user-id": "user-1" } });
      if (!res.ok) throw new Error(await res.text());
      return (await res.json()) as {
        runs: Array<{
          id: string;
          workflow_id: string;
          workflow_name: string;
          status: "running" | "success" | "failed";
          logs: Array<{ step: string; status: string }>;
          started_at: string;
          finished_at: string | null;
        }>;
      };
    },
  });

  const statusIcons: Record<string, JSX.Element> = {
    success: <CheckCircle className="w-4 h-4 text-node-trigger" />,
    failed: <XCircle className="w-4 h-4 text-destructive" />,
    running: <Clock className="w-4 h-4 text-primary" />,
  };

  const runs = data?.runs ?? [];

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Activity</h1>
        <p className="text-sm text-muted-foreground mt-1">Workflow execution history</p>
      </div>

      <div className="surface-card divide-y divide-border">
        {isLoading ? (
          <div className="p-4 text-sm text-muted-foreground">Loading…</div>
        ) : (
          runs.map((run) => (
          <div key={run.id} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {statusIcons[run.status]}
              <div>
                <p className="text-sm font-medium text-foreground">{run.workflow_name}</p>
                <p className="text-xs text-muted-foreground capitalize">{run.status}</p>
                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                  {(run.logs ?? []).slice(0, 2).map((l) => `${l.step}:${l.status}`).join(" · ") || "—"}
                </p>
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
          ))
        )}
      </div>
    </div>
  );
};

ActivityPage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;

export default ActivityPage;


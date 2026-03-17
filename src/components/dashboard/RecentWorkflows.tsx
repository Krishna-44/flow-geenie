import { Workflow } from '@/types/workflow';
import { Badge } from '@/components/ui/badge';
import { useRouter } from "next/router";

interface RecentWorkflowsProps {
  workflows: Workflow[];
}

export function RecentWorkflows({ workflows }: RecentWorkflowsProps) {
  const router = useRouter();

  return (
    <div className="surface-card">
      <div className="p-5 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Recent Workflows</h3>
      </div>
      <div className="divide-y divide-border">
        {workflows.map((w) => (
          <button
            key={w.id}
            onClick={() => router.push(`/workflows/${w.id}`)}
            className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors text-left"
          >
            <div>
              <p className="text-sm font-medium text-foreground">{w.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{w.description}</p>
            </div>
            <Badge variant={w.status === 'active' ? 'default' : 'secondary'} className={w.status === 'active' ? 'gradient-primary text-primary-foreground border-0' : ''}>
              {w.status}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  );
}

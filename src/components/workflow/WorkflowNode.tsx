import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Mail, Brain, Send, Webhook, Calendar, FileText, Share2 } from 'lucide-react';
import { StepType } from '@/types/workflow';

const providerIcons: Record<string, React.ElementType> = {
  gmail: Mail,
  email: Mail,
  openai: Brain,
  slack: Send,
  webhook: Webhook,
  calendar: Calendar,
  notion: FileText,
  google_sheets: FileText,
  rss: FileText,
  linkedin: Share2,
  twitter: Share2,
};

const typeStyles: Record<StepType, string> = {
  trigger: 'node-trigger',
  ai: 'node-ai',
  action: 'node-action',
};

const typeLabels: Record<StepType, string> = {
  trigger: 'Trigger',
  ai: 'AI Step',
  action: 'Action',
};

interface NodeData {
  label: string;
  description: string;
  type: StepType;
  provider: string;
}

export const WorkflowNode = memo(({ data }: { data: NodeData }) => {
  const Icon = providerIcons[data.provider] || Webhook;

  return (
    <div className={`px-5 py-4 rounded-xl min-w-[180px] ${typeStyles[data.type]}`}>
      <Handle type="target" position={Position.Left} className="!bg-primary !w-2.5 !h-2.5 !border-2 !border-card" />

      <div className="flex items-center gap-2.5 mb-1.5">
        <div className="p-1.5 rounded-lg bg-card">
          <Icon className="w-4 h-4 text-foreground" />
        </div>
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {typeLabels[data.type]}
        </span>
      </div>
      <p className="text-sm font-semibold text-foreground">{data.label}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{data.description}</p>

      <Handle type="source" position={Position.Right} className="!bg-primary !w-2.5 !h-2.5 !border-2 !border-card" />
    </div>
  );
});

WorkflowNode.displayName = 'WorkflowNode';

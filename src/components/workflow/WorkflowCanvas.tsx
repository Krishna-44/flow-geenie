import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  ConnectionLineType,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { WorkflowDefinition } from '@/types/workflow';
import { WorkflowNode } from './WorkflowNode';

interface WorkflowCanvasProps {
  workflow: WorkflowDefinition;
}

const nodeTypes = { workflowNode: WorkflowNode };

export function WorkflowCanvas({ workflow }: WorkflowCanvasProps) {
  const initialNodes: Node[] = useMemo(() =>
    workflow.steps.map((step, index) => ({
      id: step.id,
      type: 'workflowNode',
      position: { x: 300 * index, y: 120 },
      data: {
        label: step.label,
        description: step.description || `${step.provider}.${step.action}`,
        type: step.type,
        provider: step.provider,
      },
    })),
    [workflow]
  );

  const initialEdges: Edge[] = useMemo(() =>
    workflow.steps.slice(0, -1).map((step, index) => ({
      id: `e${step.id}-${workflow.steps[index + 1].id}`,
      source: step.id,
      target: workflow.steps[index + 1].id,
      animated: true,
      style: { stroke: 'hsl(243, 75%, 59%)', strokeWidth: 2 },
      type: 'smoothstep',
    })),
    [workflow]
  );

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="h-[500px] w-full rounded-xl border border-border bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="hsl(215, 20%, 85%)" gap={20} size={1} />
        <Controls className="!bg-card !border-border !rounded-lg !shadow-sm" />
      </ReactFlow>
    </div>
  );
}

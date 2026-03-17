import { Zap, Activity, Play } from 'lucide-react';

interface StatsCardsProps {
  total: number;
  active: number;
  runs: number;
}

export function StatsCards({ total, active, runs }: StatsCardsProps) {
  const cards = [
    { label: 'Total Automations', value: total, icon: Zap, color: 'text-primary' },
    { label: 'Active Workflows', value: active, icon: Activity, color: 'text-node-trigger' },
    { label: 'Total Runs', value: runs, icon: Play, color: 'text-node-ai' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="surface-card p-5 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">{card.label}</span>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </div>
          <p className="text-3xl font-semibold text-foreground">{card.value}</p>
        </div>
      ))}
    </div>
  );
}

import type { ReactElement } from "react";
import type { NextPageWithLayout } from "../_app";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentWorkflows } from "@/components/dashboard/RecentWorkflows";
import { Button } from "@/components/ui/button";
import { Plus, Grid, Store } from "lucide-react";
import { useRouter } from "next/router";
import { getStats, getTemplates, getWorkflows } from "@/services/database/mockData";

const DashboardPage: NextPageWithLayout = () => {
  const router = useRouter();
  const stats = getStats();
  const workflows = getWorkflows();
  const featuredTemplates = getTemplates().slice(0, 3);

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your automations</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.push("/templates")} className="btn-press">
            <Grid className="w-4 h-4 mr-2" /> Templates
          </Button>
          <Button variant="outline" onClick={() => router.push("/marketplace")} className="btn-press">
            <Store className="w-4 h-4 mr-2" /> Marketplace
          </Button>
          <Button onClick={() => router.push("/workflows/create")} className="gradient-primary text-primary-foreground btn-press">
            <Plus className="w-4 h-4 mr-2" /> Create Automation
          </Button>
        </div>
      </div>

      <StatsCards total={stats.total} active={stats.active} runs={stats.runs} />

      <div className="mt-8">
        <RecentWorkflows workflows={workflows} />
      </div>

      <div className="mt-8">
        <div className="surface-card">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Featured Templates</h3>
            <Button variant="ghost" size="sm" onClick={() => router.push("/templates")} className="text-muted-foreground">
              View all
            </Button>
          </div>
          <div className="divide-y divide-border">
            {featuredTemplates.map((t) => (
              <button
                key={t.id}
                onClick={() => router.push("/templates")}
                className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors text-left"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
                </div>
                <span className="text-[11px] text-muted-foreground">{t.category}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

DashboardPage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;

export default DashboardPage;


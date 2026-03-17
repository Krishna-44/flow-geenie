import type { ReactElement } from "react";
import type { NextPageWithLayout } from "../_app";
import { AppLayout } from "@/components/layout/AppLayout";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Sparkles } from "lucide-react";
import { installMarketplaceAutomation } from "@/services/automation/installAutomation";
import { useRouter } from "next/router";

type MarketplaceItem = {
  id: string;
  workflow_id: string;
  creator_id: string;
  title: string;
  description: string | null;
  category: string;
  installs: number;
  rating: number;
  created_at: string;
};

const CATEGORIES = ["All", "Email", "Social Media", "Productivity", "Business"];

const MarketplacePage: NextPageWithLayout = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [installingId, setInstallingId] = useState<string | null>(null);

  const queryKey = useMemo(() => ["marketplace", { search, category }], [search, category]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: async (): Promise<{ items: MarketplaceItem[] }> => {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (category !== "All") params.set("category", category);
      const res = await fetch(`/api/marketplace?${params.toString()}`);
      if (!res.ok) throw new Error(await res.text());
      return (await res.json()) as { items: MarketplaceItem[] };
    },
  });

  const items = data?.items ?? [];

  const onInstall = async (id: string) => {
    try {
      setInstallingId(id);
      // TODO: wire real auth user id from Supabase Auth.
      const userId = "user-1";
      const newWorkflowId = await installMarketplaceAutomation({ marketplaceId: id, userId });
      await router.push(`/workflows/${newWorkflowId}`);
      await refetch();
    } finally {
      setInstallingId(null);
    }
  };

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Marketplace</h1>
          <p className="text-sm text-muted-foreground mt-1">Install proven automations in one click</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/templates")} className="btn-press gap-2">
          <Sparkles className="w-4 h-4" />
          Browse Templates
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search marketplace…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Button key={c} size="sm" variant={category === c ? "default" : "outline"} className="btn-press" onClick={() => setCategory(c)}>
              {c}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground py-12">Loading marketplace…</div>
      ) : error ? (
        <div className="surface-card p-5">
          <p className="text-sm text-destructive">Failed to load marketplace.</p>
          <p className="text-xs text-muted-foreground mt-1">{String(error)}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">No automations match your search.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => (
            <div key={it.id} className="surface-card p-5 flex flex-col">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{it.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{it.description ?? "—"}</p>
                </div>
                <Badge variant="secondary" className="text-[10px] font-medium shrink-0">
                  {it.category}
                </Badge>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{it.installs} installs</span>
                <span>★ {Number(it.rating ?? 0).toFixed(1)}</span>
              </div>

              <div className="mt-4 flex gap-2">
                <Button className="flex-1 btn-press gap-2" onClick={() => onInstall(it.id)} disabled={installingId === it.id}>
                  <Download className="w-4 h-4" />
                  {installingId === it.id ? "Installing…" : "Install"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

MarketplacePage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;

export default MarketplacePage;


import type { ReactElement } from "react";
import type { NextPageWithLayout } from "../_app";
import { AppLayout } from "@/components/layout/AppLayout";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { getTemplates, TEMPLATE_CATEGORIES, type TemplateCategory } from "@/services/database/mockData";
import type { Template } from "@/types/workflow";
import { Mail, Share2, FileText, Brain, Search, Briefcase, Zap, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WorkflowCanvas } from "@/components/workflow/WorkflowCanvas";
import { installTemplateAutomation } from "@/services/automation/installAutomation";

const categoryIcons: Record<string, React.ElementType> = {
  Email: Mail,
  "Social Media": Share2,
  Productivity: FileText,
  Business: Briefcase,
};

const categoryColors: Record<string, string> = {
  Email: "bg-amber-50 text-amber-600",
  "Social Media": "bg-violet-50 text-violet-600",
  Productivity: "bg-emerald-50 text-emerald-600",
  Business: "bg-blue-50 text-blue-600",
};

const TemplatesPage: NextPageWithLayout = () => {
  const router = useRouter();
  const templates = getTemplates();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | "All">("All");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      const matchesCategory = activeCategory === "All" || t.category === activeCategory;
      const matchesSearch =
        search === "" ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [templates, activeCategory, search]);

  const handleInstallTemplate = async (template: Template) => {
    // TODO: wire real auth user id from Supabase Auth.
    const userId = "user-1";
    const { workflowId } = await installTemplateAutomation({ templateId: template.id, userId });
    await router.push(`/workflows/${workflowId}`);
  };

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Templates</h1>
        <p className="text-sm text-muted-foreground mt-1">Start with a pre-built automation — no prompt needed</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search templates…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant={activeCategory === "All" ? "default" : "outline"} size="sm" className="btn-press" onClick={() => setActiveCategory("All")}>
            All
          </Button>
          {TEMPLATE_CATEGORIES.map((cat) => {
            const Icon = categoryIcons[cat] || Zap;
            return (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                className="btn-press gap-1.5"
                onClick={() => setActiveCategory(cat)}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat}
              </Button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">No templates match your search.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => {
            const Icon = categoryIcons[t.category] || Brain;
            const color = categoryColors[t.category] || "bg-muted text-muted-foreground";
            return (
              <div key={t.id} className="surface-card p-5 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <Badge variant="secondary" className="text-[10px] font-medium">
                    {t.category}
                  </Badge>
                </div>

                <h3 className="font-medium text-foreground text-sm mb-1">{t.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1 line-clamp-3">{t.description}</p>

                <div className="flex items-center gap-1 mt-3 text-[10px] text-muted-foreground">
                  {t.template_json.steps.map((s, i) => (
                    <span key={s.id} className="flex items-center gap-1">
                      {i > 0 && <span className="text-border">→</span>}
                      <span className="truncate max-w-[80px]">{s.label}</span>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1 btn-press gap-1.5" onClick={() => setPreviewTemplate(t)}>
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </Button>
                  <Button size="sm" className="flex-1 btn-press" onClick={() => handleInstallTemplate(t)}>
                    Install
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!previewTemplate} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
        {previewTemplate && (
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${categoryColors[previewTemplate.category] || "bg-muted text-muted-foreground"}`}>
                  {(() => {
                    const Icon = categoryIcons[previewTemplate.category] || Brain;
                    return <Icon className="w-5 h-5" />;
                  })()}
                </div>
                <div>
                  <DialogTitle className="text-lg">{previewTemplate.name}</DialogTitle>
                  <Badge variant="secondary" className="mt-1 text-[10px]">
                    {previewTemplate.category}
                  </Badge>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-5 mt-2">
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Description</h4>
                <p className="text-sm text-foreground leading-relaxed">{previewTemplate.description}</p>
              </div>

              {previewTemplate.useCase && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Example Use Case</h4>
                  <p className="text-sm text-foreground leading-relaxed">{previewTemplate.useCase}</p>
                </div>
              )}

              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Workflow Preview</h4>
                <WorkflowCanvas workflow={previewTemplate.template_json} />
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
                Close
              </Button>
              <Button className="btn-press" onClick={() => handleInstallTemplate(previewTemplate)}>
                Install This Template
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

TemplatesPage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;

export default TemplatesPage;


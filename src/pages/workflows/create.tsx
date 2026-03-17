import type { ReactElement } from "react";
import type { NextPageWithLayout } from "../_app";
import { AppLayout } from "@/components/layout/AppLayout";
import { useState } from "react";
import { PromptInput } from "@/components/chat/PromptInput";
import { WorkflowCanvas } from "@/components/workflow/WorkflowCanvas";
import { generateWorkflowFromPrompt } from "@/services/ai/aiService";
import type { WorkflowDefinition } from "@/types/workflow";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Zap, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

const CreateWorkflowPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [workflow, setWorkflow] = useState<WorkflowDefinition | null>(null);
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (value: string) => {
    setIsLoading(true);
    setError("");
    setPrompt(value);
    try {
      const result = await generateWorkflowFromPrompt(value);
      setWorkflow(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate workflow");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeploy = async () => {
    // TODO: persist to Supabase (Workflows table) + redirect to workflow detail.
    await router.push("/workflows");
  };

  const suggestions = [
    "When I get a Gmail email, summarize it and send to Slack",
    "Capture form submissions to Google Sheets and notify me",
    "Extract action items from meeting notes and save to Notion",
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button
        onClick={() => router.push("/dashboard")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Create Automation</h1>
        <p className="text-sm text-muted-foreground mt-1">Describe what you want to automate</p>
      </div>

      <PromptInput onSubmit={handleSubmit} isLoading={isLoading} />

      {!workflow && !isLoading && (
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => handleSubmit(s)}
              className="px-3 py-1.5 text-xs text-muted-foreground border border-border rounded-full hover:bg-accent transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {isLoading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Generating workflow...
          </div>
        </motion.div>
      )}

      {error && <p className="mt-6 text-sm text-destructive text-center">{error}</p>}

      <AnimatePresence>
        {workflow && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-foreground">{workflow.name}</h2>
              </div>
              <Button onClick={handleDeploy} className="gradient-primary text-primary-foreground btn-press">
                <Save className="w-4 h-4 mr-2" /> Deploy Workflow
              </Button>
            </div>

            {prompt && (
              <div className="surface-card p-4 mb-4 flex items-start gap-3">
                <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">{prompt}</p>
              </div>
            )}

            <WorkflowCanvas workflow={workflow} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

CreateWorkflowPage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;

export default CreateWorkflowPage;


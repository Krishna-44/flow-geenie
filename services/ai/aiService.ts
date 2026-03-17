export type GeneratedWorkflowJson = {
  name: string;
  trigger: {
    type: string;
  };
  steps: Array<{
    type: "ai" | "action";
    action: string;
    provider?: string;
    description?: string;
  }>;
};

export type AiWorkflowGenerationResult = {
  workflow: GeneratedWorkflowJson;
  reasoning?: string;
};

/**
 * AutoFlow AI workflow generation service.
 *
 * Today: deterministic parsing + lightweight heuristics.
 * Future: swap the internals to call Claude (or another model) and validate/normalize the response.
 */
export async function generateWorkflowFromPrompt(prompt: string): Promise<AiWorkflowGenerationResult> {
  const text = prompt.trim();
  const lower = text.toLowerCase();

  // Simulate latency so the UI can show a loading state.
  await new Promise((r) => setTimeout(r, 600));

  if (lower.includes("gmail") && lower.includes("slack") && (lower.includes("summarize") || lower.includes("summary"))) {
    return {
      workflow: {
        name: "Email Summarizer",
        trigger: { type: "gmail.new_email" },
        steps: [
          { type: "ai", action: "summarize", provider: "claude", description: "Summarize the email body into key bullet points." },
          { type: "action", action: "send_message", provider: "slack", description: "Send the summary to a Slack channel." },
        ],
      },
    };
  }

  if (lower.includes("spam") && lower.includes("gmail")) {
    return {
      workflow: {
        name: "Smart Email Spam Filter",
        trigger: { type: "gmail.new_email" },
        steps: [
          { type: "ai", action: "classify", provider: "claude", description: "Classify the email as spam vs important." },
          { type: "action", action: "delete_email", provider: "gmail", description: "Delete spam emails." },
        ],
      },
    };
  }

  return {
    workflow: {
      name: "Custom Automation",
      trigger: { type: "webhook.incoming" },
      steps: [{ type: "ai", action: "process", provider: "claude", description: `Process: ${text}` }],
    },
  };
}


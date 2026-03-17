/**
 * One-click automation installer.
 *
 * Used by:
 * - Templates module
 * - Marketplace module
 *
 * Responsibilities:
 * - Fetch the source workflow JSON (template or marketplace workflow)
 * - Clone it as a new Workflow row for the current user
 * - Return the new workflow id for redirecting to the editor/detail page
 */

export async function installMarketplaceAutomation(args: { marketplaceId: string; userId: string }): Promise<string> {
  const res = await fetch("/api/marketplace/install", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ marketplace_id: args.marketplaceId, user_id: args.userId }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = (await res.json()) as { workflow_id: string };
  return data.workflow_id;
}

/**
 * Template installation is implemented as a local-to-DB clone for now.
 * Later this will fetch templates from Supabase Templates table via /api/templates.
 */
export async function installTemplateAutomation(args: {
  templateId: string;
  userId: string;
}): Promise<{ workflowId: string }> {
  const res = await fetch("/api/templates/install", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ template_id: args.templateId, user_id: args.userId }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = (await res.json()) as { workflow_id: string };
  return { workflowId: data.workflow_id };
}


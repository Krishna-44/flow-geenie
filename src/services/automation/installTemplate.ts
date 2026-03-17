import { getServerSupabase } from "@/services/database/serverSupabase";

/**
 * Install a template for a user by cloning it into the Workflows table.
 *
 * Process:
 * 1) Fetch template JSON
 * 2) Clone workflow
 * 3) Insert into Workflows
 * 4) Return new workflow id
 */
export async function installTemplate(templateId: string, userId: string): Promise<string> {
  const supabase = getServerSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const tpl = await supabase
    .from("templates")
    .select("id, name, description, template_json")
    .eq("id", templateId)
    .single();

  if (tpl.error) throw new Error(tpl.error.message);

  const inserted = await supabase
    .from("workflows")
    .insert({
      user_id: userId,
      name: tpl.data.name,
      description: tpl.data.description ?? null,
      workflow_json: tpl.data.template_json,
      status: "inactive",
    })
    .select("id")
    .single();

  if (inserted.error) throw new Error(inserted.error.message);
  return inserted.data.id as string;
}


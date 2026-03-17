import type { NextApiRequest } from "next";
import { createClient } from "@supabase/supabase-js";

export type AuthContext = { userId: string; accessToken?: string };

function getAuthHeaderToken(req: NextApiRequest) {
  const header = req.headers.authorization;
  if (!header) return null;
  const [type, token] = header.split(" ");
  if (type?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

/**
 * Server-side authentication helper.
 *
 * This expects a Supabase access token via `Authorization: Bearer <token>`.
 * For local development (until UI auth wiring is complete), it also supports:
 * - `x-user-id` header
 */
export async function requireUser(req: NextApiRequest): Promise<AuthContext> {
  const token = getAuthHeaderToken(req);

  // Dev fallback for existing UI that still uses placeholder user ids.
  const devUserId = typeof req.headers["x-user-id"] === "string" ? req.headers["x-user-id"] : null;
  if (!token && devUserId) return { userId: devUserId };

  if (!token) {
    throw new Error("UNAUTHENTICATED");
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) throw new Error("SUPABASE_NOT_CONFIGURED");

  const supabase = createClient(url, anon, { auth: { persistSession: false } });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) throw new Error("UNAUTHENTICATED");

  return { userId: data.user.id, accessToken: token };
}


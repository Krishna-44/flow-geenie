export async function connect() {
  return { ok: true as const };
}

export async function executeAction(action: string, params: Record<string, unknown>) {
  return { ok: true as const, action, params };
}

export async function disconnect() {
  return { ok: true as const };
}


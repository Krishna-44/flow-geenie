-- AutoFlow AI initial schema
-- These tables are intentionally minimal and designed to evolve as n8n + Claude integration is added.

-- Users
create table if not exists public.users (
  id uuid primary key,
  email text unique not null,
  created_at timestamptz not null default now()
);

-- Workflows
create table if not exists public.workflows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  description text,
  workflow_json jsonb not null,
  status text not null default 'inactive' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- WorkflowRuns
create table if not exists public.workflow_runs (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  status text not null check (status in ('running', 'success', 'failed')),
  logs jsonb not null default '[]'::jsonb,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

-- Templates
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text not null,
  template_json jsonb not null
);

-- updated_at trigger for workflows
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_workflows_updated_at on public.workflows;
create trigger set_workflows_updated_at
before update on public.workflows
for each row
execute function public.set_updated_at();


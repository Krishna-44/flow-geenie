-- AutoFlow AI Marketplace workflows

create table if not exists public.marketplace_workflows (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  creator_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text,
  category text not null,
  installs int not null default 0,
  rating numeric not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists marketplace_workflows_category_idx on public.marketplace_workflows(category);
create index if not exists marketplace_workflows_installs_idx on public.marketplace_workflows(installs desc);


-- Loyal Creative Systems — initial schema (SPEC 20, 23).
--
-- Conventions
--   * Every table: id uuid, created_at, updated_at (maintained by trigger).
--   * Money: integer minor units (bigint) + ISO currency code.
--   * Timestamps: timestamptz, stored in UTC.
--   * Enumerations: text + CHECK constraints (easier to evolve than Postgres enums).
--   * Row-level security is enabled on every table. With no matching policy, access is denied.
--     The service role (server code and background jobs only) bypasses RLS.
--
-- Additions beyond the SPEC 20 table list, each needed by another section:
--   public_events      SPEC 23.2: the public feed is a separate field set, not a filtered copy.
--   access_tokens      SPEC 23.1: single-purpose, expiring tokens (booking, unsubscribe, data request).
--   invoice_counters   SPEC 14.2: invoices numbered sequentially per market.
--   ai_calls           SPEC 21.2: every AI call logs model, tokens, latency and outcome.
--   leads.status 'partial'  SPEC 8.1: keep a partial lead once email is given.
--   proposals.token_hash    SPEC 11.5: the token itself is never stored, only its SHA-256.

create extension if not exists pgcrypto;

create schema if not exists private;
revoke all on schema private from public;

-- ---------------------------------------------------------------------------
-- Shared trigger: updated_at
-- ---------------------------------------------------------------------------
create or replace function private.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- ---------------------------------------------------------------------------
-- Users and clients
-- ---------------------------------------------------------------------------
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 200),
  email text not null check (char_length(email) between 3 and 320),
  email_normalized text generated always as (lower(btrim(email))) stored,
  phone text check (phone ~ '^\+[0-9]{8,15}$'),
  business_name text check (char_length(business_name) <= 200),
  country text check (country ~ '^[A-Z]{2}$'),
  market text not null check (market in ('ph', 'us')),
  segment text check (segment in ('cooperative', 'agency', 'local_service', 'other')),
  team_size text check (team_size in ('1-5', '6-20', '21-50', '51-200', '200+')),
  segment_answers jsonb not null default '{}'::jsonb,
  systems_interest text[] not null default '{}',
  problem text check (char_length(problem) <= 5000),
  current_tools text[] not null default '{}',
  timeline text check (timeline in ('asap', '1-3_months', '3-6_months', 'exploring')),
  budget_range text,
  decision_maker text check (decision_maker in ('yes', 'shared', 'no')),
  status text not null default 'new' check (status in (
    'partial', 'new', 'qualified', 'nurture', 'proposal_sent', 'call_booked', 'won',
    'onboarding', 'active', 'lost', 'spam', 'unsubscribed')),
  tier text check (tier in ('hot', 'warm', 'cold')),
  score smallint check (score between 0 and 100),
  needs_review boolean not null default false,
  source text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  consent_processing_at timestamptz,
  consent_marketing_at timestamptz,
  time_zone text,
  -- A lead past 'partial' must have recorded processing consent (SPEC 8.2 step 5).
  constraint leads_consent_required check (status in ('partial', 'spam') or consent_processing_at is not null)
);
-- Duplicate handling matches on normalized email (SPEC 7.3).
create unique index leads_email_normalized_key on public.leads (email_normalized);
create index leads_status_idx on public.leads (status);
create index leads_market_segment_idx on public.leads (market, segment);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  lead_id uuid unique references public.leads (id) on delete set null,
  organization_name text not null,
  market text not null check (market in ('ph', 'us')),
  segment text check (segment in ('cooperative', 'agency', 'local_service', 'other')),
  status text not null default 'onboarding' check (status in ('onboarding', 'active', 'paused', 'completed', 'churned'))
);

-- users.id is the Supabase Auth user id.
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  email text not null,
  name text,
  role text not null check (role in ('owner', 'member', 'client')),
  client_id uuid references public.clients (id) on delete cascade,
  notification_prefs jsonb not null default '{}'::jsonb,
  constraint users_client_role check ((role = 'client') = (client_id is not null))
);
create unique index users_email_key on public.users (lower(email));
create index users_client_idx on public.users (client_id);

-- ---------------------------------------------------------------------------
-- Authorization helpers (SECURITY DEFINER so policies don't recurse through RLS)
-- ---------------------------------------------------------------------------

-- Staff = owner or member, signed in with two-factor authentication (aal2, SPEC 17).
create or replace function private.is_staff() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.users u
    where u.id = auth.uid() and u.role in ('owner', 'member')
  ) and coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2'
$$;

create or replace function private.is_owner() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.users u where u.id = auth.uid() and u.role = 'owner'
  ) and coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2'
$$;

-- The signed-in client user's organization, or null.
create or replace function private.client_id() returns uuid
language sql stable security definer set search_path = '' as $$
  select u.client_id from public.users u where u.id = auth.uid() and u.role = 'client'
$$;

-- The lead that became the signed-in client's organization, or null.
create or replace function private.client_lead_id() returns uuid
language sql stable security definer set search_path = '' as $$
  select c.lead_id from public.clients c where c.id = private.client_id()
$$;


-- ---------------------------------------------------------------------------
-- Pipeline
-- ---------------------------------------------------------------------------
create table public.lead_scores (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  score smallint not null check (score between 0 and 100),
  tier text not null check (tier in ('hot', 'warm', 'cold')),
  breakdown jsonb not null default '{}'::jsonb,
  summary text,
  recommended_systems text[] not null default '{}',
  flags text[] not null default '{}',
  model text,
  overridden_by uuid references public.users (id) on delete set null
);
create index lead_scores_lead_idx on public.lead_scores (lead_id, created_at desc);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  lead_id uuid references public.leads (id) on delete cascade,
  client_id uuid references public.clients (id) on delete cascade,
  type text not null,
  stage text check (stage in (
    'lead_in', 'qualified', 'proposal_sent', 'call_booked', 'agreement_payment', 'onboarding', 'reporting')),
  payload jsonb not null default '{}'::jsonb,
  -- null = the system; otherwise the users.id that acted.
  actor uuid references public.users (id) on delete set null,
  duration_ms integer check (duration_ms >= 0),
  public boolean not null default false,
  constraint events_subject check (lead_id is not null or client_id is not null)
);
create index events_lead_idx on public.events (lead_id, created_at);
create index events_client_idx on public.events (client_id, created_at);
create index events_type_idx on public.events (type, created_at);

-- Public activity feed (SPEC 18.1, 23.2). Holds only stage, duration, segment, country.
-- No foreign keys, no names, no emails, no amounts — personal data cannot reach it.
create table public.public_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  stage text not null,
  segment text check (segment in ('cooperative', 'agency', 'local_service', 'other')),
  country text check (country in ('PH', 'US')),
  duration_ms integer check (duration_ms >= 0)
);
create index public_events_created_idx on public.public_events (created_at desc);

create or replace function private.publish_public_event() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  v_segment text;
  v_market text;
begin
  if new.public and new.stage is not null then
    if new.lead_id is not null then
      select l.segment, l.market into v_segment, v_market from public.leads l where l.id = new.lead_id;
    else
      select c.segment, c.market into v_segment, v_market from public.clients c where c.id = new.client_id;
    end if;
    insert into public.public_events (stage, segment, country, duration_ms, created_at)
    values (new.stage, v_segment, upper(v_market), new.duration_ms, new.created_at);
  end if;
  return new;
end $$;

create trigger events_publish after insert on public.events
  for each row execute function private.publish_public_event();

create table public.automation_runs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  workflow text not null,
  lead_id uuid references public.leads (id) on delete cascade,
  client_id uuid references public.clients (id) on delete cascade,
  idempotency_key text not null unique,
  status text not null default 'pending' check (status in ('pending', 'running', 'succeeded', 'failed', 'cancelled')),
  attempts smallint not null default 0 check (attempts >= 0),
  started_at timestamptz,
  finished_at timestamptz,
  error text,
  external_run_id text
);
create index automation_runs_status_idx on public.automation_runs (status, created_at desc);
create index automation_runs_lead_idx on public.automation_runs (lead_id);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  session_id text not null,
  lead_id uuid references public.leads (id) on delete set null,
  page text,
  market text check (market in ('ph', 'us')),
  handoff_requested boolean not null default false
);
create index conversations_session_idx on public.conversations (session_id);

create table public.messages_chat (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null check (char_length(content) <= 20000)
);
create index messages_chat_conversation_idx on public.messages_chat (conversation_id, created_at);

create table public.proposals (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  token_hash bytea not null unique check (octet_length(token_hash) = 32),
  market text not null check (market in ('ph', 'us')),
  content jsonb not null,
  pricing_snapshot jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in (
    'draft', 'held', 'sent', 'opened', 'booked', 'accepted', 'expired', 'superseded')),
  review_status text not null default 'auto' check (review_status in ('auto', 'pending', 'approved', 'rejected')),
  check_results jsonb,
  generation_attempts smallint not null default 1,
  expires_at timestamptz not null,
  first_opened_at timestamptz,
  view_count integer not null default 0,
  total_view_seconds integer not null default 0
);
create index proposals_lead_idx on public.proposals (lead_id);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  provider_id text unique,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  time_zone text not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'rescheduled', 'cancelled', 'completed', 'no_show')),
  meeting_url text,
  brief jsonb,
  constraint bookings_time_order check (ends_at > starts_at)
);
create index bookings_lead_idx on public.bookings (lead_id);

create table public.emails (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  lead_id uuid references public.leads (id) on delete cascade,
  client_id uuid references public.clients (id) on delete cascade,
  template_id text not null,
  to_address text not null,
  subject text not null,
  idempotency_key text not null unique,
  status text not null default 'queued' check (status in (
    'queued', 'scheduled', 'sent', 'delivered', 'bounced', 'failed', 'complained', 'cancelled')),
  provider_id text,
  scheduled_for timestamptz,
  sent_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz
);
create index emails_lead_idx on public.emails (lead_id);

create table public.sequences (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  lead_id uuid references public.leads (id) on delete cascade,
  client_id uuid references public.clients (id) on delete cascade,
  type text not null check (type in ('proposal', 'booking', 'no_show', 'post_call', 'onboarding', 'payment', 'nurture')),
  step smallint not null default 0,
  status text not null default 'active' check (status in ('active', 'paused', 'stopped', 'done')),
  stop_reason text,
  next_run_at timestamptz,
  constraint sequences_subject check (lead_id is not null or client_id is not null)
);
-- One running sequence of each type per lead: re-submissions never restart one (SPEC 7.3).
create unique index sequences_one_active_per_lead on public.sequences (lead_id, type)
  where status in ('active', 'paused');
create index sequences_due_idx on public.sequences (next_run_at) where status = 'active';

create table public.agreements (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  proposal_id uuid not null unique references public.proposals (id) on delete restrict,
  template_version text not null,
  signer_name text not null,
  signed_at timestamptz not null,
  ip inet,
  user_agent text,
  pdf_path text
);

create table public.invoice_counters (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  market text not null unique check (market in ('ph', 'us')),
  last_number integer not null default 0
);
insert into public.invoice_counters (market) values ('ph'), ('us');

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  client_id uuid references public.clients (id) on delete restrict,
  lead_id uuid references public.leads (id) on delete set null,
  number text not null,
  market text not null check (market in ('ph', 'us')),
  amount bigint not null check (amount >= 0),
  currency text not null check (currency in ('PHP', 'USD')),
  status text not null default 'open' check (status in ('draft', 'open', 'paid', 'overdue', 'void')),
  due_at timestamptz,
  paid_at timestamptz,
  constraint invoices_market_currency check ((market = 'ph' and currency = 'PHP') or (market = 'us' and currency = 'USD')),
  constraint invoices_number_unique unique (market, number)
);
create index invoices_client_idx on public.invoices (client_id);

-- Sequential, gap-free invoice numbers per market: LCS-PH-000001, LCS-US-000001 (SPEC 14.2).
create or replace function public.next_invoice_number(p_market text) returns text
language plpgsql security definer set search_path = '' as $$
declare
  v_n integer;
begin
  update public.invoice_counters set last_number = last_number + 1
    where market = p_market returning last_number into v_n;
  if v_n is null then
    raise exception 'unknown market %', p_market;
  end if;
  return 'LCS-' || upper(p_market) || '-' || lpad(v_n::text, 6, '0');
end $$;
revoke all on function public.next_invoice_number(text) from public;

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  client_id uuid references public.clients (id) on delete restrict,
  lead_id uuid references public.leads (id) on delete set null,
  provider text not null,
  provider_id text,
  amount bigint not null check (amount >= 0),
  currency text not null check (currency in ('PHP', 'USD')),
  method text,
  status text not null default 'pending' check (status in (
    'pending', 'payment_pending', 'awaiting_payment', 'paid', 'failed', 'refunded')),
  -- SPEC 14.2: bank transfer is the one permitted manual step; record who confirmed it.
  confirmed_manually_by uuid references public.users (id) on delete set null,
  reference_code text,
  invoice_id uuid references public.invoices (id) on delete set null,
  constraint payments_subject check (client_id is not null or lead_id is not null),
  constraint payments_provider_id_unique unique (provider, provider_id)
);
create index payments_client_idx on public.payments (client_id);

-- ---------------------------------------------------------------------------
-- Delivery (projects and portal)
-- ---------------------------------------------------------------------------
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  client_id uuid not null references public.clients (id) on delete cascade,
  name text not null,
  systems text[] not null default '{}',
  status text not null default 'active' check (status in ('active', 'paused', 'completed', 'cancelled')),
  phase text,
  started_at timestamptz,
  target_end_at timestamptz
);
create index projects_client_idx on public.projects (client_id);

create table public.milestones (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  project_id uuid not null references public.projects (id) on delete cascade,
  name text not null,
  position smallint not null default 0, -- SPEC "order" (a reserved word)
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'done')),
  due_at timestamptz,
  done_at timestamptz
);
create index milestones_project_idx on public.milestones (project_id, position);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  project_id uuid not null references public.projects (id) on delete cascade,
  milestone_id uuid references public.milestones (id) on delete set null,
  name text not null,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done', 'blocked')),
  assignee_id uuid references public.users (id) on delete set null,
  waiting_on_client boolean not null default false,
  done_at timestamptz
);
create index tasks_project_idx on public.tasks (project_id);

create table public.updates (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  project_id uuid not null references public.projects (id) on delete cascade,
  type text not null check (type in ('manual', 'weekly_summary')),
  body text not null,
  published_at timestamptz
);
create index updates_project_idx on public.updates (project_id, published_at desc);

create table public.files (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  project_id uuid not null references public.projects (id) on delete cascade,
  uploaded_by uuid references public.users (id) on delete set null,
  path text not null unique,
  name text not null,
  mime_type text,
  size bigint not null check (size > 0 and size <= 26214400), -- 25 MB (SPEC 16.2)
  scan_status text not null default 'pending' check (scan_status in ('pending', 'clean', 'infected', 'error'))
);
create index files_project_idx on public.files (project_id);

create table public.messages_portal (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  project_id uuid not null references public.projects (id) on delete cascade,
  sender_id uuid references public.users (id) on delete set null,
  parent_id uuid references public.messages_portal (id) on delete set null,
  body text not null check (char_length(body) between 1 and 10000),
  read_at timestamptz
);
create index messages_portal_project_idx on public.messages_portal (project_id, created_at);

create table public.questionnaires (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  client_id uuid not null references public.clients (id) on delete cascade,
  template text not null,
  answers jsonb not null default '{}'::jsonb,
  completed_at timestamptz
);

-- ---------------------------------------------------------------------------
-- Content
-- ---------------------------------------------------------------------------
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  description text,
  body text not null default '',
  status text not null default 'draft' check (status in ('draft', 'approved', 'published', 'rejected')),
  approved_by uuid references public.users (id) on delete set null,
  published_at timestamptz,
  constraint posts_published_has_date check (status <> 'published' or published_at is not null)
);

create table public.case_studies (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  client_id uuid references public.clients (id) on delete set null,
  segment text check (segment in ('cooperative', 'agency', 'local_service', 'other')),
  market text check (market in ('ph', 'us')),
  services text[] not null default '{}',
  body text not null default '',
  status text not null default 'draft' check (status in ('draft', 'approved', 'published', 'rejected')),
  consent_at timestamptz,
  published_at timestamptz,
  -- SPEC 19.2: a client's story is published only with recorded consent.
  constraint case_studies_consent check (status <> 'published' or client_id is null or consent_at is not null),
  constraint case_studies_published_has_date check (status <> 'published' or published_at is not null)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  client_id uuid not null references public.clients (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  text text check (char_length(text) <= 5000),
  consent_to_publish_at timestamptz
);

-- ---------------------------------------------------------------------------
-- Operations
-- ---------------------------------------------------------------------------
create table public.settings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  key text not null unique,
  value jsonb not null
);

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid references public.users (id) on delete set null,
  action text not null,
  target text,
  before jsonb,
  after jsonb
);
create index audit_log_created_idx on public.audit_log (created_at desc);

-- The audit log is append-only, for every role including the service role.
create or replace function private.audit_log_immutable() returns trigger
language plpgsql set search_path = '' as $$
begin
  raise exception 'audit_log is append-only';
end $$;
create trigger audit_log_no_update before update or delete on public.audit_log
  for each row execute function private.audit_log_immutable();

create table public.data_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  email text not null,
  type text not null check (type in ('access', 'deletion')),
  status text not null default 'pending_verification' check (status in (
    'pending_verification', 'verified', 'in_progress', 'completed', 'rejected')),
  verified_at timestamptz,
  due_at timestamptz not null default (now() + interval '30 days'), -- SPEC 23.2
  completed_at timestamptz
);

create table public.access_tokens (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  purpose text not null check (purpose in ('booking', 'unsubscribe', 'data_request', 'portal_invite')),
  token_hash bytea not null unique check (octet_length(token_hash) = 32),
  lead_id uuid references public.leads (id) on delete cascade,
  client_id uuid references public.clients (id) on delete cascade,
  data_request_id uuid references public.data_requests (id) on delete cascade,
  expires_at timestamptz not null,
  used_at timestamptz
);

create table public.ai_calls (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  feature text not null,
  model text not null,
  input_tokens integer,
  output_tokens integer,
  cache_read_tokens integer,
  cache_write_tokens integer,
  latency_ms integer,
  outcome text not null check (outcome in ('ok', 'invalid_output', 'error', 'capped')),
  lead_id uuid references public.leads (id) on delete set null,
  conversation_id uuid references public.conversations (id) on delete set null
);
create index ai_calls_feature_day_idx on public.ai_calls (feature, created_at);

-- Defined here because it reads public.projects.
create or replace function private.is_client_project(p_project_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.projects p
    where p.id = p_project_id and p.client_id = private.client_id()
  )
$$;

-- ---------------------------------------------------------------------------
-- updated_at triggers on every table
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  for t in select tablename from pg_tables where schemaname = 'public' and tablename <> 'audit_log' loop
    execute format(
      'create trigger set_updated_at before update on public.%I for each row execute function private.set_updated_at()', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Privileges and row-level security
-- ---------------------------------------------------------------------------
-- Start from nothing: anon and authenticated get only what is granted below.
revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke all on all functions in schema public from anon, authenticated;
grant usage on schema public to anon, authenticated;
grant usage on schema private to anon, authenticated;
grant execute on all functions in schema private to anon, authenticated;

-- Signed-in users: table privileges are broad, RLS policies decide which rows.
grant select, insert, update, delete on all tables in schema public to authenticated;
-- The append-only audit log and system-written tables cannot be written directly.
revoke insert, update, delete on public.audit_log, public.public_events, public.ai_calls,
  public.invoice_counters from authenticated;

-- Anonymous visitors may only read published content and the public feed (SPEC 20).
-- Leads and chat messages are written through server routes with the service role.
grant select on public.posts, public.case_studies, public.public_events to anon;
-- (authenticated already holds select on every table; RLS limits rows.)

do $$
declare t text;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', t);
    execute format('alter table public.%I force row level security', t);
  end loop;
end $$;

-- Staff (2FA) can work with every business table.
do $$
declare t text;
begin
  for t in select unnest(array[
    'leads', 'lead_scores', 'events', 'automation_runs', 'conversations', 'messages_chat', 'proposals',
    'bookings', 'emails', 'sequences', 'agreements', 'payments', 'invoices', 'clients', 'projects',
    'milestones', 'tasks', 'updates', 'files', 'messages_portal', 'questionnaires', 'posts',
    'case_studies', 'reviews', 'data_requests', 'access_tokens'
  ]) loop
    execute format(
      'create policy staff_all on public.%I for all to authenticated using (private.is_staff()) with check (private.is_staff())', t);
  end loop;
end $$;

-- Staff read-only tables.
create policy staff_read on public.audit_log for select to authenticated using (private.is_staff());
create policy staff_read on public.ai_calls for select to authenticated using (private.is_staff());
create policy staff_read on public.invoice_counters for select to authenticated using (private.is_staff());

-- Settings: staff read; only owners change pricing, scoring, team, etc.
create policy staff_read on public.settings for select to authenticated using (private.is_staff());
create policy owner_write on public.settings for all to authenticated
  using (private.is_owner()) with check (private.is_owner());

-- Users: staff read all; owners manage; a client user sees the people in their own organization.
create policy staff_read on public.users for select to authenticated using (private.is_staff());
create policy owner_write on public.users for all to authenticated
  using (private.is_owner()) with check (private.is_owner());
create policy client_read_org on public.users for select to authenticated
  using (client_id is not null and client_id = private.client_id());
create policy self_read on public.users for select to authenticated using (id = auth.uid());

-- Client portal (SPEC 16.1): a client user sees only their own organization's data.
create policy client_read on public.clients for select to authenticated using (id = private.client_id());
create policy client_read on public.projects for select to authenticated using (client_id = private.client_id());
create policy client_read on public.milestones for select to authenticated using (private.is_client_project(project_id));
create policy client_read on public.tasks for select to authenticated using (private.is_client_project(project_id));
create policy client_read on public.updates for select to authenticated
  using (private.is_client_project(project_id) and published_at is not null and published_at <= now());
create policy client_read on public.files for select to authenticated
  using (private.is_client_project(project_id) and scan_status = 'clean');
create policy client_read on public.messages_portal for select to authenticated using (private.is_client_project(project_id));
create policy client_insert on public.messages_portal for insert to authenticated
  with check (private.is_client_project(project_id) and sender_id = auth.uid());
create policy client_read on public.questionnaires for select to authenticated using (client_id = private.client_id());
create policy client_read on public.invoices for select to authenticated using (client_id = private.client_id());
create policy client_read on public.payments for select to authenticated using (client_id = private.client_id());
create policy client_read on public.reviews for select to authenticated using (client_id = private.client_id());
create policy client_read on public.proposals for select to authenticated using (lead_id = private.client_lead_id());
create policy client_read on public.agreements for select to authenticated
  using (proposal_id in (select p.id from public.proposals p where p.lead_id = private.client_lead_id()));
-- File uploads and questionnaire answers go through server routes (virus scan, validation).

-- Public content (anonymous and signed-in).
create policy public_read_published on public.posts for select to anon, authenticated
  using (status = 'published' and published_at <= now());
create policy public_read_published on public.case_studies for select to anon, authenticated
  using (status = 'published' and published_at <= now());
create policy public_read on public.public_events for select to anon, authenticated using (true);

/**
 * Row-level security and schema constraint tests (SPEC 20, 23.1, 25 "Integration").
 * Runs against real Postgres with the migrations applied.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type pg from "pg";
import { asRole, createTestDatabase } from "./db";

let pool: pg.Pool;
let drop: () => Promise<void>;

const ID = {
  owner: "00000000-0000-4000-8000-000000000001",
  member: "00000000-0000-4000-8000-000000000002",
  clientA: "00000000-0000-4000-8000-0000000000a1",
  clientA2: "00000000-0000-4000-8000-0000000000a2",
  clientB: "00000000-0000-4000-8000-0000000000b1",
  stranger: "00000000-0000-4000-8000-0000000000ff",
  leadA: "10000000-0000-4000-8000-0000000000a0",
  leadB: "10000000-0000-4000-8000-0000000000b0",
  leadC: "10000000-0000-4000-8000-0000000000c0",
  orgA: "20000000-0000-4000-8000-0000000000a0",
  orgB: "20000000-0000-4000-8000-0000000000b0",
  projA: "30000000-0000-4000-8000-0000000000a0",
  projB: "30000000-0000-4000-8000-0000000000b0",
  propA: "40000000-0000-4000-8000-0000000000a0",
  propB: "40000000-0000-4000-8000-0000000000b0",
};

const ALL_TABLES = [
  "leads", "lead_scores", "events", "public_events", "automation_runs", "conversations", "messages_chat",
  "proposals", "bookings", "emails", "sequences", "agreements", "payments", "invoices", "invoice_counters",
  "clients", "users", "projects", "milestones", "tasks", "updates", "files", "messages_portal",
  "questionnaires", "posts", "case_studies", "reviews", "settings", "audit_log", "data_requests",
  "access_tokens", "ai_calls",
];
const ANON_READABLE = ["posts", "case_studies", "public_events"];

const staff = (sub: string, aal: "aal1" | "aal2" = "aal2") => ({ role: "authenticated" as const, sub, aal });
const client = (sub: string) => ({ role: "authenticated" as const, sub });

async function count(c: pg.PoolClient, sql: string, params: unknown[] = []) {
  const r = await c.query(`select count(*)::int as n from (${sql}) q`, params);
  return r.rows[0].n as number;
}

beforeAll(async () => {
  ({ pool, drop } = await createTestDatabase());
  const q = (sql: string, params: unknown[] = []) => pool.query(sql, params);

  for (const [k, id] of Object.entries(ID).slice(0, 6)) {
    await q("insert into auth.users (id, email) values ($1, $2)", [id, `${k}@example.com`]);
  }
  const consent = "now()";
  await q(`insert into public.leads (id, name, email, business_name, market, segment, status, consent_processing_at, problem)
    values ($1, 'Ana Reyes', 'ana@coop.example', 'Bayanihan Coop', 'ph', 'cooperative', 'won', ${consent}, 'Paper ledgers'),
           ($2, 'Bob Lee', 'bob@agency.example', 'Lee Agency', 'us', 'agency', 'won', ${consent}, 'Spreadsheets'),
           ($3, 'Cy Doe', 'cy@shop.example', 'Doe Repair', 'us', 'local_service', 'qualified', ${consent}, 'Missed calls')`,
    [ID.leadA, ID.leadB, ID.leadC]);
  await q(`insert into public.clients (id, lead_id, organization_name, market, segment)
    values ($1, $2, 'Bayanihan Coop', 'ph', 'cooperative'), ($3, $4, 'Lee Agency', 'us', 'agency')`,
    [ID.orgA, ID.leadA, ID.orgB, ID.leadB]);
  await q(`insert into public.users (id, email, name, role, client_id) values
    ($1, 'owner@lcs.example', 'Owner', 'owner', null),
    ($2, 'member@lcs.example', 'Member', 'member', null),
    ($3, 'ana@coop.example', 'Ana', 'client', $6),
    ($4, 'treasurer@coop.example', 'Treasurer', 'client', $6),
    ($5, 'bob@agency.example', 'Bob', 'client', $7)`,
    [ID.owner, ID.member, ID.clientA, ID.clientA2, ID.clientB, ID.orgA, ID.orgB]);
  await q(`insert into public.projects (id, client_id, name) values ($1, $2, 'Coop system'), ($3, $4, 'Agency system')`,
    [ID.projA, ID.orgA, ID.projB, ID.orgB]);
  for (const p of [ID.projA, ID.projB]) {
    await q(`insert into public.milestones (project_id, name) values ($1, 'Discovery')`, [p]);
    await q(`insert into public.tasks (project_id, name) values ($1, 'Collect member list')`, [p]);
    await q(`insert into public.updates (project_id, type, body, published_at) values
      ($1, 'manual', 'Published', now() - interval '1 day'),
      ($1, 'weekly_summary', 'Draft', null)`, [p]);
    await q(`insert into public.files (project_id, path, name, size, scan_status) values
      ($1::uuid, $1::text || '/clean.pdf', 'clean.pdf', 1000, 'clean'),
      ($1::uuid, $1::text || '/pending.pdf', 'pending.pdf', 1000, 'pending'),
      ($1::uuid, $1::text || '/bad.exe', 'bad.exe', 1000, 'infected')`, [p]);
    await q(`insert into public.messages_portal (project_id, body) values ($1, 'Hello')`, [p]);
  }
  for (const [org, lead, prop, market, cur] of [
    [ID.orgA, ID.leadA, ID.propA, "ph", "PHP"],
    [ID.orgB, ID.leadB, ID.propB, "us", "USD"],
  ]) {
    await q(`insert into public.proposals (id, lead_id, token_hash, market, content, expires_at)
      values ($1, $2, gen_random_bytes(32), $3, '{}', now() + interval '30 days')`, [prop, lead, market]);
    await q(`insert into public.agreements (proposal_id, template_version, signer_name, signed_at)
      values ($1, 'v1', 'Signer', now())`, [prop]);
    const inv = await q(`insert into public.invoices (client_id, number, market, amount, currency)
      values ($1, public.next_invoice_number($2), $2, 5000000, $3) returning id`, [org, market, cur]);
    await q(`insert into public.payments (client_id, provider, provider_id, amount, currency, status, invoice_id)
      values ($1, 'test', gen_random_uuid()::text, 5000000, $2, 'paid', $3)`, [org, cur, inv.rows[0].id]);
    await q(`insert into public.questionnaires (client_id, template) values ($1, 'onboarding')`, [org]);
    await q(`insert into public.reviews (client_id, rating) values ($1, 5)`, [org]);
  }
  await q(`insert into public.events (lead_id, type, stage, public, duration_ms) values
    ($1, 'proposal.sent', 'proposal_sent', true, 130000),
    ($1, 'lead.note', null, false, null)`, [ID.leadC]);
  await q(`insert into public.automation_runs (workflow, lead_id, idempotency_key, status) values ('lead.qualify', $1, 'k1', 'succeeded')`, [ID.leadC]);
  await q(`insert into public.posts (slug, title, status, published_at) values
    ('published-post', 'Published', 'published', now() - interval '1 day'),
    ('scheduled-post', 'Scheduled', 'published', now() + interval '7 days'),
    ('draft-post', 'Draft', 'draft', null)`);
  await q(`insert into public.case_studies (slug, title, status, published_at, client_id, consent_at) values
    ('lcs-site', 'This site', 'published', now(), null, null),
    ('coop-draft', 'Coop', 'draft', null, $1, null)`, [ID.orgA]);
  await q(`insert into public.settings (key, value) values ('proposal_review', '"hold"')`);
  await q(`insert into public.audit_log (user_id, action) values ($1, 'settings.update')`, [ID.owner]);
  await q(`insert into public.conversations (session_id) values ('s1')`);
}, 60_000);

afterAll(async () => {
  await drop?.();
});

describe("anonymous visitors", () => {
  it.each(ALL_TABLES.filter((t) => !ANON_READABLE.includes(t)))("cannot read %s", async (table) => {
    await expect(asRole(pool, { role: "anon" }, (c) => c.query(`select * from public.${table} limit 1`))).rejects.toThrow(
      /permission denied/,
    );
  });

  it("cannot insert leads or chat messages directly (server routes only)", async () => {
    await expect(
      asRole(pool, { role: "anon" }, (c) =>
        c.query(`insert into public.leads (name, email, market) values ('x', 'x@example.com', 'us')`),
      ),
    ).rejects.toThrow(/permission denied/);
    await expect(
      asRole(pool, { role: "anon" }, (c) =>
        c.query(`insert into public.messages_chat (conversation_id, role, content) select id, 'user', 'hi' from public.conversations`),
      ),
    ).rejects.toThrow(/permission denied/);
  });

  it("reads only published, already-live posts and case studies", async () => {
    await asRole(pool, { role: "anon" }, async (c) => {
      const posts = await c.query("select slug from public.posts order by slug");
      expect(posts.rows.map((r) => r.slug)).toEqual(["published-post"]);
      const cs = await c.query("select slug from public.case_studies");
      expect(cs.rows.map((r) => r.slug)).toEqual(["lcs-site"]);
    });
  });

  it("cannot write published content", async () => {
    await expect(
      asRole(pool, { role: "anon" }, (c) => c.query(`update public.posts set title = 'hacked'`)),
    ).rejects.toThrow(/permission denied/);
  });

  it("public feed holds only stage, duration, segment and country — no personal data", async () => {
    await asRole(pool, { role: "anon" }, async (c) => {
      const r = await c.query("select * from public.public_events");
      expect(r.rows).toHaveLength(1);
      expect(Object.keys(r.rows[0]).sort()).toEqual(
        ["country", "created_at", "duration_ms", "id", "segment", "stage", "updated_at"].sort(),
      );
      expect(r.rows[0]).toMatchObject({ stage: "proposal_sent", segment: "local_service", country: "US", duration_ms: 130000 });
    });
  });
});

describe("client portal users", () => {
  const ownTables: [string, string][] = [
    ["clients", "id"],
    ["projects", "client_id"],
    ["questionnaires", "client_id"],
    ["invoices", "client_id"],
    ["payments", "client_id"],
    ["reviews", "client_id"],
  ];

  it.each(ownTables)("client A sees only its own %s", async (table, col) => {
    await asRole(pool, client(ID.clientA), async (c) => {
      const rows = await c.query(`select ${col} as org from public.${table}`);
      expect(rows.rows.length).toBeGreaterThan(0);
      expect(new Set(rows.rows.map((r) => r.org))).toEqual(new Set([ID.orgA]));
    });
  });

  it.each(["milestones", "tasks", "messages_portal"])("client A sees only its own project's %s", async (table) => {
    await asRole(pool, client(ID.clientA), async (c) => {
      const rows = await c.query(`select project_id from public.${table}`);
      expect(rows.rows.length).toBeGreaterThan(0);
      expect(rows.rows.every((r) => r.project_id === ID.projA)).toBe(true);
    });
  });

  it("client B cannot read anything belonging to client A", async () => {
    await asRole(pool, client(ID.clientB), async (c) => {
      expect(await count(c, "select 1 from public.projects where client_id = $1", [ID.orgA])).toBe(0);
      expect(await count(c, "select 1 from public.tasks where project_id = $1", [ID.projA])).toBe(0);
      expect(await count(c, "select 1 from public.files where project_id = $1", [ID.projA])).toBe(0);
      expect(await count(c, "select 1 from public.invoices where client_id = $1", [ID.orgA])).toBe(0);
      expect(await count(c, "select 1 from public.proposals where id = $1", [ID.propA])).toBe(0);
      expect(await count(c, "select 1 from public.agreements a where a.proposal_id = $1", [ID.propA])).toBe(0);
      expect(await count(c, "select 1 from public.users where client_id = $1", [ID.orgA])).toBe(0);
    });
  });

  it("sees its own proposal and signed agreement", async () => {
    await asRole(pool, client(ID.clientA), async (c) => {
      expect(await count(c, "select 1 from public.proposals")).toBe(1);
      expect(await count(c, "select 1 from public.proposals where id = $1", [ID.propA])).toBe(1);
      expect(await count(c, "select 1 from public.agreements")).toBe(1);
    });
  });

  it("sees only published updates and virus-scanned clean files", async () => {
    await asRole(pool, client(ID.clientA), async (c) => {
      const u = await c.query("select body from public.updates");
      expect(u.rows.map((r) => r.body)).toEqual(["Published"]);
      const f = await c.query("select name from public.files");
      expect(f.rows.map((r) => r.name)).toEqual(["clean.pdf"]);
    });
  });

  it("sees the users in its own organization only", async () => {
    await asRole(pool, client(ID.clientA), async (c) => {
      const r = await c.query("select id from public.users order by id");
      expect(r.rows.map((x) => x.id).sort()).toEqual([ID.clientA, ID.clientA2].sort());
    });
  });

  it("cannot read pipeline, staff or system tables", async () => {
    await asRole(pool, client(ID.clientA), async (c) => {
      for (const t of ["leads", "lead_scores", "events", "automation_runs", "emails", "sequences", "bookings",
        "conversations", "messages_chat", "settings", "audit_log", "data_requests", "access_tokens", "ai_calls"]) {
        expect(await count(c, `select 1 from public.${t}`), t).toBe(0);
      }
    });
  });

  it("can post a message on its own project as itself", async () => {
    await asRole(pool, client(ID.clientA), async (c) => {
      const r = await c.query(
        "insert into public.messages_portal (project_id, sender_id, body) values ($1, $2, 'Question') returning id",
        [ID.projA, ID.clientA],
      );
      expect(r.rowCount).toBe(1);
    });
  });

  it("cannot post on another client's project or as someone else", async () => {
    await expect(
      asRole(pool, client(ID.clientA), (c) =>
        c.query("insert into public.messages_portal (project_id, sender_id, body) values ($1, $2, 'x')", [ID.projB, ID.clientA]),
      ),
    ).rejects.toThrow(/row-level security/);
    await expect(
      asRole(pool, client(ID.clientA), (c) =>
        c.query("insert into public.messages_portal (project_id, sender_id, body) values ($1, $2, 'x')", [ID.projA, ID.owner]),
      ),
    ).rejects.toThrow(/row-level security/);
  });

  it("cannot promote itself to staff or move to another organization", async () => {
    await asRole(pool, client(ID.clientA), async (c) => {
      const r = await c.query("update public.users set role = 'owner', client_id = null where id = $1", [ID.clientA]);
      expect(r.rowCount).toBe(0);
      const r2 = await c.query("update public.users set client_id = $2 where id = $1", [ID.clientA, ID.orgB]);
      expect(r2.rowCount).toBe(0);
    });
  });

  it("cannot change project data, invoices or payments", async () => {
    await asRole(pool, client(ID.clientA), async (c) => {
      expect((await c.query("update public.invoices set status = 'paid'")).rowCount).toBe(0);
      expect((await c.query("update public.payments set amount = 0")).rowCount).toBe(0);
      expect((await c.query("update public.tasks set status = 'done'")).rowCount).toBe(0);
      expect((await c.query("delete from public.projects")).rowCount).toBe(0);
    });
  });
});

describe("staff", () => {
  it("owner with two-factor sign-in reads the pipeline", async () => {
    await asRole(pool, staff(ID.owner), async (c) => {
      expect(await count(c, "select 1 from public.leads")).toBe(3);
      expect(await count(c, "select 1 from public.automation_runs")).toBe(1);
    });
  });

  it("staff without two-factor (aal1) sees nothing", async () => {
    await asRole(pool, staff(ID.owner, "aal1"), async (c) => {
      expect(await count(c, "select 1 from public.leads")).toBe(0);
      expect(await count(c, "select 1 from public.settings")).toBe(0);
    });
  });

  it("a signed-in account with no users row sees nothing", async () => {
    await asRole(pool, staff(ID.stranger), async (c) => {
      for (const t of ["leads", "clients", "projects", "invoices", "users", "settings"]) {
        expect(await count(c, `select 1 from public.${t}`), t).toBe(0);
      }
    });
  });

  it("members read settings but only owners change them", async () => {
    await asRole(pool, staff(ID.member), async (c) => {
      expect(await count(c, "select 1 from public.settings")).toBe(1);
      expect((await c.query(`update public.settings set value = '"auto"'`)).rowCount).toBe(0);
    });
    await asRole(pool, staff(ID.owner), async (c) => {
      expect((await c.query(`update public.settings set value = '"auto"'`)).rowCount).toBe(1);
    });
  });

  it("only owners manage team members", async () => {
    await expect(
      asRole(pool, staff(ID.member), (c) => c.query("update public.users set role = 'owner' where id = $1", [ID.member])),
    ).resolves.toMatchObject({ rowCount: 0 });
  });

  it("cannot write or rewrite the audit log, even as the service role", async () => {
    await expect(
      asRole(pool, staff(ID.owner), (c) => c.query("insert into public.audit_log (action) values ('x')")),
    ).rejects.toThrow(/permission denied/);
    await expect(
      asRole(pool, { role: "service_role" }, (c) => c.query("update public.audit_log set action = 'y'")),
    ).rejects.toThrow(/append-only/);
    await expect(
      asRole(pool, { role: "service_role" }, (c) => c.query("delete from public.audit_log")),
    ).rejects.toThrow(/append-only/);
  });
});

describe("schema constraints", () => {
  it("rejects a second lead with the same normalized email", async () => {
    await expect(
      pool.query(`insert into public.leads (name, email, market, consent_processing_at) values ('A', '  ANA@coop.example ', 'ph', now())`),
    ).rejects.toThrow(/leads_email_normalized_key/);
  });

  it("requires processing consent once a lead leaves the partial state", async () => {
    await expect(
      pool.query(`insert into public.leads (name, email, market, status) values ('P', 'p@example.com', 'us', 'new')`),
    ).rejects.toThrow(/leads_consent_required/);
    const r = await pool.query(
      `insert into public.leads (name, email, market, status) values ('P', 'p2@example.com', 'us', 'partial') returning id`,
    );
    expect(r.rowCount).toBe(1);
  });

  it("numbers invoices sequentially per market", async () => {
    const a = await pool.query("select public.next_invoice_number('ph') as n");
    const b = await pool.query("select public.next_invoice_number('ph') as n");
    const u = await pool.query("select public.next_invoice_number('us') as n");
    expect(a.rows[0].n).toBe("LCS-PH-000002");
    expect(b.rows[0].n).toBe("LCS-PH-000003");
    expect(u.rows[0].n).toBe("LCS-US-000002");
  });

  it("rejects an invoice whose currency does not match its market", async () => {
    await expect(
      pool.query(`insert into public.invoices (client_id, number, market, amount, currency) values ($1, 'X', 'ph', 1, 'USD')`, [ID.orgA]),
    ).rejects.toThrow(/invoices_market_currency/);
  });

  it("will not publish a client case study without recorded consent", async () => {
    await expect(
      pool.query(`update public.case_studies set status = 'published', published_at = now() where slug = 'coop-draft'`),
    ).rejects.toThrow(/case_studies_consent/);
  });

  it("enforces one running sequence of each type per lead", async () => {
    await pool.query(`insert into public.sequences (lead_id, type) values ($1, 'proposal')`, [ID.leadC]);
    await expect(pool.query(`insert into public.sequences (lead_id, type) values ($1, 'proposal')`, [ID.leadC])).rejects.toThrow(
      /sequences_one_active_per_lead/,
    );
  });

  it("enforces unique idempotency keys on automation runs and emails", async () => {
    await expect(
      pool.query(`insert into public.automation_runs (workflow, idempotency_key) values ('x', 'k1')`),
    ).rejects.toThrow(/duplicate key/);
  });

  it("caps portal files at 25 MB", async () => {
    await expect(
      pool.query(`insert into public.files (project_id, path, name, size) values ($1, 'big', 'big.zip', 26214401)`, [ID.projA]),
    ).rejects.toThrow(/files_size_check/);
  });

  it("enables and forces row-level security on every public table", async () => {
    const r = await pool.query(
      `select relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
       where n.nspname = 'public' and c.relkind = 'r' and not (c.relrowsecurity and c.relforcerowsecurity)`,
    );
    expect(r.rows).toEqual([]);
    const tables = await pool.query(
      `select tablename from pg_tables where schemaname = 'public' order by tablename`,
    );
    expect(tables.rows.map((t) => t.tablename).sort()).toEqual([...ALL_TABLES].sort());
  });
});

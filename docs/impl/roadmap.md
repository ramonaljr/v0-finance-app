## Implementation Roadmap

Default stack assumed: Next.js (App Router) + Supabase/Postgres + Tailwind/shadcn + OpenAI. Adapt paths if your repo differs but preserve intent.

### 2-Week MVP Plan (acceptance criteria oriented)

Week 1
- Finalize schema + RLS
  - Add `supabase/migrations/0001_init.sql` with tables: users, accounts, categories, transactions, budgets, budget_items, insights, kpi_cache, calendar_cache, ai_logs; indexes; RLS `user_id = auth.uid()`.
- Minimal APIs
  - `GET /api/stats/period?ym=YYYY-MM` and `GET /api/stats/calendar?ym=YYYY-MM` reading from caches (stub until materializers land).
  - `POST /api/transactions` (bulk) stub that validates payload and returns 202.
  - `POST /api/budgets` and `PUT /api/budgets/:id` stubs.
- AI foundation (read-only)
  - `lib/ai/select-ledger.ts` returns windowed aggregates; prompts in `ai/prompts/`.
  - `POST /api/ai/insights/run` writes to `insights` (stub compute); `GET /api/insights` lists.
- Docs + Risks
  - Fill `docs/audit/findings.md`; write risk log.

Week 2
- Materializers & Jobs
  - Edge function or cron to populate `kpi_cache`, `calendar_cache`; run nightly and on mutation.
  - `POST /api/transactions/recurring/run` basic recurring engine.
- CSV Import
  - `POST /api/imports/csv`; mapping UI on `transactions` page; persists as transactions.
- AI Coach
  - `POST /api/ai/coach` chat using `select-ledger` summarized data; cost guardrails + consent.
- Auto-Budget (propose only)
  - `POST /api/ai/auto-budget/propose` returns category allocations; user confirms via budgets PUT.
- Tests
  - Playwright: import CSV → add recurring → create budget → view calendar net → receive insight → accept auto-budget.
  - Unit tests for SQL views/rollovers.

### Phase 2 (Weeks 3-6)
- Banking integrations (Plaid/Yodlee) behind feature flag.
- Auto-categorization (rules + ML fallback to last-seen mapping).
- Multi-currency support (minor units + FX table + display).
- Reports export endpoints (CSV/JSON) and email delivery.
- Advanced a11y passes, list virtualization, pagination everywhere.
- Observability: domain logs, metrics, alerting.

### Non-negotiables
- Money stored in minor units; never float.
- RLS on every table; least-privileged service role in server code only.
- AI analysis first; writes only on explicit user confirmation.



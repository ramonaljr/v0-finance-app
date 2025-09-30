## Personal Finance App — Product + Tech Audit Findings

Scope: Next.js web app in `app/` with client-side UI components. No database schema or server domain services were found. This audit maps current coverage vs. MVP goals and proposes implementation-ready tasks.

### Code Map (high-level)
- **Routes (pages)**
  - `app/page.tsx` (Home, AI Insights teaser, FAB to AI Coach)
  - `app/transaction/page.tsx`, `app/transactions/page.tsx` (Transactions + Calendar UI)
  - `app/budget/page.tsx`, `app/budgets/page.tsx` (Budget UI, charts)
  - `app/insights/page.tsx` (Insights UI shell)
  - `app/account/page.tsx`, `app/setting/page.tsx`
- **API routes (existing)**
  - `app/api/extract-receipt/route.ts`, `app/api/extract-voice/route.ts` (AI extraction helpers)
- **Components**
  - Transactions: `components/transaction-sheet.tsx`, `components/transaction-entry-sheet.tsx`, `components/financial-calendar.tsx`, `components/transaction-spending-pie-chart.tsx`
  - Budgets: `components/budget-pie-chart.tsx`
  - AI: `components/ai-coach-fab.tsx`, `components/ai-coach-sheet.tsx`, `components/ai-log-sheet.tsx`
  - UI: `components/ui/*`
- **Lib**: `lib/*` (colors, tokens, utils, motion)

No `supabase/`, `db/`, `prisma/`, or migrations found. No server-side data access for finance domain.

### Functionality Gap Checklist

Legend: Present / Partial / Missing

| Area | Status | Notes / Links |
|---|---|---|
| A. Transactions CRUD (amount, date, account, payee, category, notes, tags, attachments) | Partial | UI shells present: `app/transaction/page.tsx`, `components/transaction-sheet.tsx`; No backend models/endpoints; attachments UI present but no storage integration. |
| Recurring rules (interval, next_run, autopost) | Missing | No data model or scheduler. |
| Bulk import CSV | Missing | No `/api/imports/csv`; no mapping UI. |
| Auto-categorization (rules/ML) | Missing | No rules engine; no mapping cache. |
| Multi-currency (minor units + currency code) | Missing | UI uses floats and `$` formatting; no currency handling. |
| Reconciliation flags; soft delete; audit history | Missing | No fields or history tables. |
| B. Budgets (zero-based/caps/envelopes, rollovers) | Partial | UI charts and tabs exist: `app/budget/page.tsx`, `app/budgets/page.tsx`; no persistence; no rollover engine. |
| Periods (monthly, custom start day) | Missing | Not in data model/UI options. |
| Progress & alerts | Partial | UI hints; no computed backend metrics/alerts. |
| Auto-Budget | Missing | No AI budget proposal endpoints. |
| C. KPIs & Insights (spend by cat/time, cashflow, savings rate, burn/runway) | Partial | Static UI summaries; no `kpi_cache`, no endpoints. |
| Insight cards & explainability | Partial | `app/insights/page.tsx` exists but not wired to data. |
| Reports export (CSV/JSON) | Missing | No export endpoints. |
| D. Calendar Daily Net | Partial | `components/financial-calendar.tsx` shows a grid; no server data; no `calendar_cache` API. |
| Filters (range/category) | Partial | Some local filters in pages; not backed by APIs. |
| E. AI Capabilities (Coach, Insights, Auto-Budget) | Partial | AI UI components exist; AI extraction endpoints exist; missing `ai/select-ledger`, prompts, and AI endpoints per spec. |
| Guardrails (cost caps, redaction, consent, logs) | Missing | No `ai_logs` table; no consent tracking. |
| F. Non-negotiables: RLS, validation, rate limits, idempotency | Missing | No database or policies present. |
| a11y (focus order, semantics, 44px targets) | Partial | Shadcn components help; focus management not enforced in dialogs/sheets; needs audit. |
| Perf (indexes, pagination, virtualization, N+1) | Missing | No DB; lists are unvirtualized; no pagination on APIs. |
| Tests/Observability | Missing | No unit/e2e tests; no logging of domain actions. |

### Data Model (reference to implement)
- See planned migration: `supabase/migrations/0001_init.sql`
  - Tables: `users`, `accounts`, `categories`, `transactions`, `budgets`, `budget_items`, `insights`, `kpi_cache`, `calendar_cache`, `ai_logs`
  - Indexes: `(user_id, occurred_at)`, `(user_id, category_id, occurred_at)`, `(user_id, period_year, period_month)`
  - RLS policy: `USING (user_id = auth.uid())`

### APIs & Services (desired surface)
- Transactions: `POST /api/transactions` (bulk), `GET /api/transactions`, `POST /api/transactions/recurring/run`
- Imports: `POST /api/imports/csv`
- Stats: `GET /api/stats/period?ym=YYYY-MM`, `GET /api/stats/calendar?ym=YYYY-MM`
- Budgets: `POST /api/budgets`, `PUT /api/budgets/:id`
- Insights: `POST /api/ai/insights/run`, `GET /api/insights`
- AI: `POST /api/ai/auto-budget/propose`, `POST /api/ai/coach`

### Security & Compliance
- Missing: Supabase RLS, encryption-at-rest for attachments (Supabase Storage), PII redaction in AI prompts, consent/logging.
- Actions: implement RLS on all tables, server-only service role usage in server routes, input validation and rate limiting on APIs, prompt hashing and budget caps.

### UI & State
- UI organized under `app/` routes; components in `components/` and `components/ui/`.
- No shared store detected (Zustand/Redux). Consider SWR/React Query for client caching once APIs exist.

### Next Steps
- See implementation roadmap in `docs/impl/roadmap.md`.



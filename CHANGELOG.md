# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Week 1-2 Sprint: Security & Performance (2025-10-03)

#### Added
- **Security**: AI consent enforcement on all AI endpoints ([#P0](docs/week-1-2-implementation-summary.md#1-ai-consent-gate-p0-))
  - AI coach blocked without user consent (returns 403)
  - AI auto-budget requires consent
  - Consent check in `/api/ai/coach` and `/api/ai/auto-budget`

- **Security**: PII redaction validation ([#P0](docs/week-1-2-implementation-summary.md#3-pii-redaction-validation-p0-))
  - Enhanced redaction patterns (credit cards, SSN, phone, email)
  - 20+ unit tests for PII patterns
  - Validates redaction before logging to AI

- **Reliability**: Recurring transaction idempotency ([#P0](docs/week-1-2-implementation-summary.md#2-recurring-transaction-idempotency-p0-))
  - Prevents duplicate transactions on concurrent runs
  - Idempotency key: `{template_id}:{YYYY-MM-DD}`
  - Unique constraint on `transactions.idempotency_key`

- **Reliability**: Cache refresh retry queue ([#P0](docs/week-1-2-implementation-summary.md#4-cache-refresh-retry-queue-p0-))
  - Automatic retry on cache refresh failures (3 attempts)
  - Queue table with status tracking
  - Deduplication within 5 minutes

- **Observability**: Sentry error tracking ([#P1](docs/week-1-2-implementation-summary.md#5-sentry-integration-p1-))
  - Client-side error tracking
  - Server-side error tracking
  - Edge runtime support
  - Source map uploads
  - 10% session replay sampling

- **Performance**: Dashboard server-side prefetch ([#P1](docs/week-1-2-implementation-summary.md#6-dashboard-prefetch-p1-))
  - Prefetches KPI cache, calendar cache, transactions in parallel
  - React Query hydration boundary
  - Expected TTI reduction: 40-60% (from 3-4s to <2s)

- **Performance**: Web Vitals tracking ([#P1](docs/week-1-2-implementation-summary.md#7-web-vitals-tracking-p1-))
  - Vercel Speed Insights integration
  - Tracks FCP, LCP, TTI, FID, CLS
  - Automatic reporting to Vercel dashboard

- **UX**: Calculator input component ([#P1](docs/week-1-2-implementation-summary.md#8-calculator-integration-p1-))
  - Integrated into transaction forms
  - On-screen number pad with operations
  - Expression preview and evaluation
  - Safe expression parser (no `eval()`)

- **Database**: New migrations
  - `0002_add_recurring_idempotency.sql` - Idempotency columns and indexes
  - `0003_add_cache_refresh_queue.sql` - Queue table and functions

- **Testing**: E2E tests for AI consent
  - 4 test scenarios validating consent enforcement
  - Tests both blocked (403) and allowed (200) states

- **Testing**: Unit tests for PII redaction
  - 20+ test cases covering all patterns
  - Email, credit card, SSN, phone, account numbers
  - Edge cases and mixed PII scenarios

- **Documentation**:
  - [Week 1-2 Implementation Summary](docs/week-1-2-implementation-summary.md)
  - [Migration Guide](docs/MIGRATION_GUIDE.md)
  - [Deployment Checklist](docs/DEPLOYMENT_CHECKLIST.md)
  - [AI Cost Optimization](docs/ai-cost-optimization.md)

#### Changed
- **Build**: Updated `next.config.mjs` with Sentry webpack plugin
- **Layout**: Added Speed Insights to root layout
- **API**: Transaction POST now enqueues cache refresh with retry
- **Engine**: Recurring engine uses idempotency check instead of date range search
- **AI**: PII redaction now includes SSN and phone patterns
- **Scripts**: Reorganized test scripts in `package.json`
  - `pnpm test` now runs both unit and E2E tests
  - Separate `test:unit` and `test:e2e` commands

#### Fixed
- Cache refresh silent failures (now queued with retry)
- Potential recurring transaction duplicates (idempotency keys)
- Incomplete PII redaction patterns (added SSN, phone)
- Missing error tracking (Sentry integration)
- Slow dashboard loads (prefetch optimization)

#### Removed
- **Cleanup**: Deleted old page files
  - `app/account/page-old.tsx`
  - `app/setting/page-old.tsx`
  - `app/transactions/page-old.tsx`

#### Dependencies
- **Added**: `@sentry/nextjs@^10.17.0` - Error tracking
- **Added**: `@vercel/speed-insights@^1.2.0` - Web Vitals monitoring
- **Added**: `@vitejs/plugin-react@^5.0.4` - Vite React plugin (dev)

---

## Previous Releases

### Week 2 MVP + Modern UI Design
See commit: `feat: Complete Week 2 MVP + Modern UI Design`

**Features**:
- Materializers & cache system
- Recurring transactions engine
- CSV import
- AI features (coach, auto-budget)
- Modern UI design system
- Calculator component
- Test infrastructure

---

## Migration Notes

### Upgrading from Pre-Week-1-2 Sprint

#### Database Migrations Required
```bash
# Apply migrations via Supabase dashboard or CLI
# See docs/MIGRATION_GUIDE.md for full instructions
```

#### Environment Variables Required
```bash
# Add to Vercel/production environment
NEXT_PUBLIC_SENTRY_DSN=your_dsn
SENTRY_DSN=your_dsn
SENTRY_ORG=your_org
SENTRY_PROJECT=your_project
SENTRY_AUTH_TOKEN=your_token
```

#### Breaking Changes
None. All changes are backward compatible.

#### Deprecations
None in this release.

---

## Roadmap

### Phase 2 (Weeks 3-6)

#### Epic 1: Test Coverage (Week 3-4)
- Unit tests for materializers (80% coverage target)
- Integration tests for CSV import
- E2E tests for recurring transactions
- Visual regression tests

#### Epic 2: Accessibility (Week 4-5)
- ARIA labels for calculator and forms
- Keyboard navigation for calendar
- Contrast fixes for glass-morphism cards
- axe-core integration in CI

#### Epic 3: UX Unification (Week 5-6)
- Deprecate old `/budgets` and `/transactions` routes
- Design system audit and unification
- Empty states for all pages
- Loading skeletons

#### Epic 4: Performance (Week 6)
- Edge caching for materializer results
- Lazy-load calendar component
- API payload compression
- Image optimization

---

## Support

- **Issues**: https://github.com/[your-repo]/issues
- **Documentation**: [docs/](./docs/)
- **Deployment**: [DEPLOYMENT_CHECKLIST.md](./docs/DEPLOYMENT_CHECKLIST.md)

---

**Maintained by**: [Your Team]
**Last Updated**: 2025-10-03

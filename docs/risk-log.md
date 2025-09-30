## Risk Log

### PII & Privacy
- Risk: Leaking PII via prompts or logs.
  - Mitigation: Redact PII before prompts; store only hashed prompts and redacted content in `ai_logs`; explicit consent screen; RLS on all logs.

### Cost Controls
- Risk: Unbounded AI costs due to large contexts.
  - Mitigation: Hash inputs and cache for 24h; cap tokens per request; truncate to last 90 days; rate limit endpoints.

### Performance
- Risk: Slow stats rendering from heavy queries.
  - Mitigation: Materialize `kpi_cache` and `calendar_cache`; recompute on write/nightly; add key indexes.

### Data Integrity
- Risk: Floating-point money calculations.
  - Mitigation: Store amounts in minor units (bigint); format in UI.

### Security
- Risk: Cross-tenant data exposure.
  - Mitigation: Strict RLS by `user_id = auth.uid()`; least-privileged service role only in server code.



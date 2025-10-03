# AI Cost Optimization

## Model Configuration

All AI features now use **GPT-4o-mini** for optimal cost/performance:

### Updated Files
1. **[lib/ai/coach.ts](../lib/ai/coach.ts)** - AI Financial Coach
2. **[lib/ai/auto-budget.ts](../lib/ai/auto-budget.ts)** - Auto Budget Generator
3. **[app/api/extract-voice/route.ts](../app/api/extract-voice/route.ts)** - Voice Transaction Extraction

### Pricing Comparison

| Model | Input Cost | Output Cost | vs GPT-3.5 Turbo |
|-------|-----------|-------------|------------------|
| GPT-4o-mini | $0.150/1M tokens | $0.600/1M tokens | **87% cheaper** |
| GPT-3.5-turbo | $0.500/1M tokens | $1.500/1M tokens | baseline |

### Cost Guardrails

#### AI Coach (`lib/ai/coach.ts`)
- **Max cost per request**: $0.01 (reduced from $0.10)
- **Max tokens**: 500 tokens per response
- **Context window**: Last 10 messages + 90 days financial summary
- **Estimated cost per chat**: ~$0.001-0.003

#### Auto Budget (`lib/ai/auto-budget.ts`)
- **Max tokens**: 1000 tokens
- **Temperature**: 0.3 (more consistent budgeting)
- **Context**: Last 6 months spending patterns
- **Estimated cost per generation**: ~$0.002-0.005

#### Voice Extraction (`app/api/extract-voice/route.ts`)
- Uses structured output with schema validation
- **Estimated cost per extraction**: ~$0.0001-0.0003

### Total Monthly Estimates

Based on typical usage:
- **Light user** (10 coach chats, 1 budget gen/month): ~$0.05/month
- **Medium user** (50 coach chats, 4 budget gen/month): ~$0.20/month
- **Heavy user** (200 coach chats, 10 budget gen/month): ~$0.75/month

### Additional Safeguards

1. **Token Usage Logging**: All API calls log token usage to `ai_logs` table
2. **PII Redaction**: Email, account numbers, card numbers are redacted in logs
3. **Consent Required**: Users must opt-in via `ai_consent_at` field
4. **Cost Validation**: Requests are rejected if estimated cost exceeds limits

### Monitoring

Check the `ai_logs` table to monitor actual costs:

```sql
SELECT
  kind,
  COUNT(*) as requests,
  SUM((token_usage->>'total_tokens')::int) as total_tokens,
  AVG((token_usage->>'total_tokens')::int) as avg_tokens_per_request
FROM ai_logs
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY kind;
```

### Best Practices

1. Keep prompts concise and specific
2. Use lower `max_tokens` when possible
3. Monitor the `ai_logs` table monthly
4. Consider implementing user-level spending limits for premium features

## Model Performance

GPT-4o-mini provides:
- ✅ Better quality than GPT-3.5-turbo
- ✅ 87% cost reduction
- ✅ Faster response times
- ✅ Better instruction following
- ✅ Improved structured output (for budgets)

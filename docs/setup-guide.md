# Setup Guide - Week 1 Implementation

This guide will help you set up the Supabase backend and configure the environment for the finance app.

## Prerequisites

- Node.js 18+ and pnpm installed
- Supabase account (free tier is sufficient)
- OpenAI API key (for AI features)

## 1. Supabase Setup

### Create a new Supabase project:
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization and enter project details
4. Wait for the project to be created

### Get your project credentials:
1. Go to Project Settings > API
2. Copy your Project URL and anon/public key
3. Go to Project Settings > API > Service Role (keep this secret!)

### Run the database migration:
1. In your Supabase dashboard, go to SQL Editor
2. Copy the contents of `supabase/migrations/0001_init.sql`
3. Paste and run the SQL to create all tables, indexes, and RLS policies

## 2. Environment Configuration

Create a `.env.local` file in your project root with:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration (for AI features)
OPENAI_API_KEY=your_openai_api_key
```

## 3. Install Dependencies

```bash
pnpm install
```

## 4. Test the Setup

### Start the development server:
```bash
pnpm dev
```

### Test API endpoints:
1. Visit `http://localhost:3000/api/stats/period?ym=2024-10` 
2. You should get a JSON response (even if empty data)

### Create a test user:
1. Go to Authentication > Users in your Supabase dashboard
2. Create a new user or sign up through your app
3. The user will automatically be added to the `users` table

## 5. Test Data Flow

### Add sample transactions:
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "transactions": [{
      "amount_minor": 2500,
      "currency_code": "USD", 
      "direction": "out",
      "occurred_at": "2024-10-15T10:00:00Z",
      "payee": "Test Store",
      "notes": "Sample transaction"
    }]
  }'
```

### Refresh caches:
```bash
curl -X POST http://localhost:3000/api/cache/refresh
```

### Generate insights:
```bash
curl -X POST http://localhost:3000/api/ai/insights/run
```

## 6. UI Integration

The app now has real API endpoints. You can:

1. **View insights**: Visit `/insights` to see AI-generated insights
2. **Add transactions**: Use the transaction forms (they'll save to the database)
3. **View stats**: The stats endpoints now return real data from the cache

## 7. Week 2 Implementation Complete! 🎉

All Week 2 features are now implemented:

### ✅ Edge Functions
- **Cache Refresh**: `supabase/functions/refresh-caches/` - Updates KPI and calendar caches nightly
- **Recurring Transactions**: `supabase/functions/process-recurring/` - Processes due recurring transactions

### ✅ CSV Import
- Full CSV parsing with column mapping
- Transaction creation from imported data
- Error handling and validation

### ✅ AI Coach Chat
- Real-time chat with financial context
- Cost guardrails and consent tracking
- PII redaction and logging

### ✅ Auto-Budget Proposals
- AI-powered budget suggestions based on spending patterns
- Zero-based budgeting support
- Category-specific allocations with confidence scores

### ✅ Testing
- **Playwright E2E**: Golden path tests (CSV → Recurring → Budget → Calendar → Insights → Auto-Budget)
- **Vitest Unit**: Budget calculation and AI logic tests

## 8. Next Steps (Phase 2 - Weeks 3-6)

- Banking integrations (Plaid/Yodlee)
- Auto-categorization with ML fallback
- Multi-currency support
- Advanced reporting and exports
- Performance optimizations and a11y improvements

## Troubleshooting

### Common Issues:

1. **"Unauthorized" errors**: Make sure you're signed in to Supabase Auth
2. **Database connection errors**: Verify your environment variables
3. **RLS policy errors**: Ensure the migration ran successfully
4. **Empty data**: Add some test transactions first

### Debug Mode:
Add `console.log` statements in API routes to debug data flow.

### Database Queries:
Use the Supabase dashboard SQL editor to run queries and inspect data.

## Security Notes

- Never commit `.env.local` to version control
- The service role key has full database access - keep it secure
- RLS policies ensure users can only access their own data
- All money amounts are stored in minor units (cents) to avoid floating-point errors

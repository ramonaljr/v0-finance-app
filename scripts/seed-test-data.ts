/**
 * Test script to seed sample data
 * Run with: tsx scripts/seed-test-data.ts
 *
 * Prerequisites:
 * 1. Create a test user via /auth/register
 * 2. Get your user ID from Supabase dashboard
 * 3. Update the userId variable below
 */

import { createClient } from '@supabase/supabase-js'

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const userId = 'YOUR_USER_ID_HERE' // Replace with actual user ID

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedTestData() {
  console.log('🌱 Seeding test data...\n')

  try {
    // 1. Create categories
    console.log('📁 Creating categories...')
    const categories = [
      { name: 'Food & Dining', icon: '🍔', color: '#FF5722' },
      { name: 'Transportation', icon: '🚗', color: '#2196F3' },
      { name: 'Shopping', icon: '🛍️', color: '#9C27B0' },
      { name: 'Entertainment', icon: '🎬', color: '#FF9800' },
      { name: 'Salary', icon: '💰', color: '#4CAF50' },
    ]

    const { data: createdCategories, error: catError } = await supabase
      .from('categories')
      .insert(categories.map(c => ({ ...c, user_id: userId })))
      .select()

    if (catError) throw catError
    console.log(`✅ Created ${createdCategories.length} categories\n`)

    // 2. Create account
    console.log('🏦 Creating account...')
    const { data: account, error: accError } = await supabase
      .from('accounts')
      .insert({
        user_id: userId,
        name: 'Main Checking',
        type: 'checking',
        currency_code: 'USD',
        balance_minor: 500000, // $5,000
      })
      .select()
      .single()

    if (accError) throw accError
    console.log(`✅ Created account: ${account.name}\n`)

    // 3. Create transactions (last 30 days)
    console.log('💸 Creating transactions...')
    const transactions = []
    const now = new Date()

    // Sample transactions
    const txSamples = [
      { category: 'Food & Dining', amount: 2550, days_ago: 1, payee: 'Starbucks' },
      { category: 'Food & Dining', amount: 4500, days_ago: 2, payee: 'Restaurant' },
      { category: 'Transportation', amount: 5000, days_ago: 3, payee: 'Uber' },
      { category: 'Shopping', amount: 15000, days_ago: 5, payee: 'Amazon' },
      { category: 'Food & Dining', amount: 3200, days_ago: 7, payee: 'Grocery Store' },
      { category: 'Entertainment', amount: 12000, days_ago: 10, payee: 'Movie Theater' },
      { category: 'Transportation', amount: 7500, days_ago: 12, payee: 'Gas Station' },
      { category: 'Food & Dining', amount: 1800, days_ago: 14, payee: 'Coffee Shop' },
      { category: 'Salary', amount: 500000, days_ago: 15, payee: 'Acme Corp', direction: 'in' },
      { category: 'Shopping', amount: 25000, days_ago: 18, payee: 'Electronics Store' },
    ]

    for (const tx of txSamples) {
      const category = createdCategories.find(c => c.name === tx.category)
      const occurredAt = new Date(now)
      occurredAt.setDate(occurredAt.getDate() - tx.days_ago)

      transactions.push({
        user_id: userId,
        account_id: account.id,
        category_id: category?.id,
        amount_minor: tx.amount,
        currency_code: 'USD',
        direction: tx.direction || 'out',
        occurred_at: occurredAt.toISOString(),
        payee: tx.payee,
        notes: 'Test transaction',
      })
    }

    const { data: createdTx, error: txError } = await supabase
      .from('transactions')
      .insert(transactions)
      .select()

    if (txError) throw txError
    console.log(`✅ Created ${createdTx.length} transactions\n`)

    // 4. Materialize caches
    console.log('⚡ Materializing caches...')
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()

    // Note: In real app, call the API endpoint instead
    console.log(`📊 Call POST /api/cache/refresh to materialize caches for ${currentYear}-${currentMonth}\n`)

    console.log('✨ Test data seeded successfully!')
    console.log('\n📋 Next steps:')
    console.log('1. Login to your app at http://localhost:3004/auth/login')
    console.log('2. Call POST /api/cache/refresh to update caches')
    console.log('3. View the dashboard at http://localhost:3004')

  } catch (error) {
    console.error('❌ Error seeding data:', error)
    process.exit(1)
  }
}

// Run the seeder
seedTestData()

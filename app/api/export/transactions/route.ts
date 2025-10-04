import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'csv'
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')

    // Fetch transactions
    let query = supabase
      .from('transactions')
      .select('*, accounts(name), categories(name)')
      .eq('user_id', user.id)
      .order('occurred_at', { ascending: false })

    if (startDate) {
      query = query.gte('occurred_at', startDate)
    }
    if (endDate) {
      query = query.lte('occurred_at', endDate)
    }

    const { data: transactions, error } = await query

    if (error) {
      console.error('Error fetching transactions:', error)
      return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
    }

    if (format === 'csv') {
      // Generate CSV
      const csv = generateCSV(transactions)

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="transactions_${new Date().toISOString().split('T')[0]}.csv"`,
        },
      })
    }

    return NextResponse.json({ transactions }, { status: 200 })
  } catch (error) {
    console.error('Error in export API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function generateCSV(transactions: any[]): string {
  const headers = ['Date', 'Description', 'Category', 'Account', 'Amount', 'Type', 'Notes']
  const rows = transactions.map((t) => [
    new Date(t.occurred_at).toLocaleDateString(),
    t.payee || t.description || '-',
    t.categories?.name || '-',
    t.accounts?.name || '-',
    (t.amount_minor / 100).toFixed(2),
    t.direction === 'in' ? 'Income' : 'Expense',
    t.notes || '-'
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  return csvContent
}

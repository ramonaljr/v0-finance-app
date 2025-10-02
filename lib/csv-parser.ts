import Papa from 'papaparse'

export interface CSVRow {
  date?: string
  amount?: string
  description?: string
  payee?: string
  category?: string
  account?: string
  notes?: string
  tags?: string
}

export interface ParsedCSVData {
  data: CSVRow[]
  errors: Papa.ParseError[]
  meta: Papa.ParseMeta
}

export interface ImportMapping {
  dateColumn: string
  amountColumn: string
  descriptionColumn: string
  payeeColumn?: string
  categoryColumn?: string
  accountColumn?: string
  notesColumn?: string
  tagsColumn?: string
}

export interface MappedTransaction {
  amount_minor: number
  currency_code: string
  direction: 'in' | 'out'
  occurred_at: string
  payee?: string
  notes?: string
  tags?: string[]
  category_id?: string
  account_id?: string
}

export function parseCSV(csvContent: string): ParsedCSVData {
  return Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header: string) => header.trim().toLowerCase(),
    transform: (value: string) => value.trim()
  })
}

export function detectColumns(rows: CSVRow[]): {
  possibleDateColumns: string[]
  possibleAmountColumns: string[]
  possibleDescriptionColumns: string[]
  possiblePayeeColumns: string[]
  possibleCategoryColumns: string[]
  possibleAccountColumns: string[]
} {
  const headers = Object.keys(rows[0] || {})

  const possibleDateColumns = headers.filter(h =>
    /\b(date|time|timestamp|when)\b/i.test(h) ||
    /\b(date|dt)\b/.test(h)
  )

  const possibleAmountColumns = headers.filter(h =>
    /\b(amount|value|sum|total|price|cost)\b/i.test(h) ||
    /\b(amt|val|sum|tot|price|cost)\b/.test(h)
  )

  const possibleDescriptionColumns = headers.filter(h =>
    /\b(description|desc|memo|reference|ref|detail)\b/i.test(h) ||
    /\b(desc|memo|ref|detail)\b/.test(h)
  )

  const possiblePayeeColumns = headers.filter(h =>
    /\b(payee|merchant|vendor|store|from|to)\b/i.test(h) ||
    /\b(payee|merchant|vendor|store)\b/.test(h)
  )

  const possibleCategoryColumns = headers.filter(h =>
    /\b(category|cat|type|class|group)\b/i.test(h) ||
    /\b(cat|type|class|group)\b/.test(h)
  )

  const possibleAccountColumns = headers.filter(h =>
    /\b(account|acct|bank|card)\b/i.test(h) ||
    /\b(acct|bank|card)\b/.test(h)
  )

  return {
    possibleDateColumns,
    possibleAmountColumns,
    possibleDescriptionColumns,
    possiblePayeeColumns,
    possibleCategoryColumns,
    possibleAccountColumns,
  }
}

export async function mapCSVToTransactions(
  csvData: CSVRow[],
  mapping: ImportMapping,
  userId: string,
  supabase: any
): Promise<{
  transactions: MappedTransaction[]
  errors: string[]
  warnings: string[]
}> {
  const errors: string[] = []
  const warnings: string[] = []
  const transactions: MappedTransaction[] = []

  // Get user's accounts and categories for mapping
  const [accountsResult, categoriesResult] = await Promise.all([
    supabase.from('accounts').select('id, name').eq('user_id', userId),
    supabase.from('categories').select('id, name').eq('user_id', userId)
  ])

  if (accountsResult.error) {
    errors.push(`Failed to load accounts: ${accountsResult.error.message}`)
    return { transactions: [], errors, warnings }
  }

  if (categoriesResult.error) {
    errors.push(`Failed to load categories: ${categoriesResult.error.message}`)
    return { transactions: [], errors, warnings }
  }

  const accounts = new Map(accountsResult.data?.map(a => [a.name.toLowerCase(), a.id]) || [])
  const categories = new Map(categoriesResult.data?.map(c => [c.name.toLowerCase(), c.id]) || [])

  for (let i = 0; i < csvData.length; i++) {
    const row = csvData[i]

    try {
      // Parse date
      if (!row[mapping.dateColumn]) {
        errors.push(`Row ${i + 1}: Missing date`)
        continue
      }

      const date = new Date(row[mapping.dateColumn]!)
      if (isNaN(date.getTime())) {
        errors.push(`Row ${i + 1}: Invalid date format: ${row[mapping.dateColumn]}`)
        continue
      }

      // Parse amount
      if (!row[mapping.amountColumn]) {
        errors.push(`Row ${i + 1}: Missing amount`)
        continue
      }

      const amountStr = row[mapping.amountColumn]!.replace(/[$,]/g, '')
      const amount = parseFloat(amountStr)

      if (isNaN(amount)) {
        errors.push(`Row ${i + 1}: Invalid amount: ${row[mapping.amountColumn]}`)
        continue
      }

      // Determine direction (positive = income, negative = expense)
      const direction: 'in' | 'out' = amount >= 0 ? 'in' : 'out'
      const amount_minor = Math.round(Math.abs(amount) * 100)

      // Map optional fields
      const payee = mapping.payeeColumn && row[mapping.payeeColumn]
        ? row[mapping.payeeColumn]
        : undefined

      const notes = mapping.notesColumn && row[mapping.notesColumn]
        ? row[mapping.notesColumn]
        : mapping.descriptionColumn && row[mapping.descriptionColumn]
        ? row[mapping.descriptionColumn]
        : undefined

      const tags = mapping.tagsColumn && row[mapping.tagsColumn]
        ? row[mapping.tagsColumn]!.split(/[,;]/).map(t => t.trim()).filter(Boolean)
        : undefined

      // Map category
      let category_id: string | undefined
      if (mapping.categoryColumn && row[mapping.categoryColumn]) {
        const categoryName = row[mapping.categoryColumn]!.toLowerCase()
        const categoryId = categories.get(categoryName)
        if (!categoryId) {
          warnings.push(`Row ${i + 1}: Category "${row[mapping.categoryColumn]}" not found, using uncategorized`)
        } else {
          category_id = categoryId
        }
      }

      // Map account
      let account_id: string | undefined
      if (mapping.accountColumn && row[mapping.accountColumn]) {
        const accountName = row[mapping.accountColumn]!.toLowerCase()
        const accountId = accounts.get(accountName)
        if (!accountId) {
          warnings.push(`Row ${i + 1}: Account "${row[mapping.accountColumn]}" not found`)
        } else {
          account_id = accountId
        }
      }

      transactions.push({
        amount_minor,
        currency_code: 'USD', // Default, could be made configurable
        direction,
        occurred_at: date.toISOString(),
        payee,
        notes,
        tags,
        category_id,
        account_id,
      })
    } catch (error) {
      errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return { transactions, errors, warnings }
}


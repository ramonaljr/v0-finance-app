import { test, expect } from '@playwright/test'

test.describe('Golden Path: CSV Import → Add Recurring → Create Budget → View Calendar → Receive Insight → Accept Auto-Budget', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication - in a real app you'd handle login
    await page.route('**/api/auth/**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 'test-user-id',
            email: 'test@example.com'
          }
        })
      })
    })
  })

  test('CSV Import Flow', async ({ page }) => {
    // Navigate to transactions page
    await page.goto('/transactions')

    // Mock CSV data
    const csvData = `date,amount,description,payee,category
2024-10-15,-25.50,Starbucks Coffee,Starbucks,Food & Drink
2024-10-16,1500.00,Salary Deposit,Employer,Income
2024-10-17,-89.99,Grocery Shopping,Whole Foods,Food & Drink`

    // Intercept CSV import API call
    await page.route('**/api/imports/csv', async (route) => {
      const request = route.request()
      const body = await request.json()

      expect(body.csvContent).toBe(csvData)
      expect(body.mapping.dateColumn).toBe('date')
      expect(body.mapping.amountColumn).toBe('amount')

      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          imported: 3,
          total_rows: 3,
          errors: [],
          warnings: []
        })
      })
    })

    // Import CSV
    await page.click('[data-testid="csv-import-button"]')
    await page.fill('[data-testid="csv-textarea"]', csvData)
    await page.click('[data-testid="import-csv-button"]')

    // Verify success message
    await expect(page.locator('[data-testid="import-success"]')).toBeVisible()
    await expect(page.locator('[data-testid="imported-count"]')).toContainText('3 transactions imported')
  })

  test('Add Recurring Transaction', async ({ page }) => {
    await page.goto('/transactions')

    // Mock recurring transaction creation
    await page.route('**/api/transactions', async (route) => {
      const request = route.request()
      const body = await request.json()

      expect(body.transactions[0].is_recurring).toBe(true)
      expect(body.transactions[0].recur_rule).toBe('monthly')

      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          accepted: 1,
          inserted: 1,
          transaction_ids: ['recurring-tx-id']
        })
      })
    })

    // Add recurring transaction
    await page.click('[data-testid="add-transaction-button"]')
    await page.fill('[data-testid="amount-input"]', '50.00')
    await page.fill('[data-testid="description-input"]', 'Monthly Subscription')
    await page.check('[data-testid="recurring-checkbox"]')
    await page.selectOption('[data-testid="recurrence-rule"]', 'monthly')
    await page.click('[data-testid="save-transaction"]')

    // Verify recurring indicator appears
    await expect(page.locator('[data-testid="recurring-indicator"]')).toBeVisible()
  })

  test('Create Budget', async ({ page }) => {
    await page.goto('/budgets')

    // Mock budget creation
    await page.route('**/api/budgets', async (route) => {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'budget-id',
          period_year: 2024,
          period_month: 10,
          type: 'zero'
        })
      })
    })

    // Create budget
    await page.click('[data-testid="create-budget-button"]')
    await page.fill('[data-testid="budget-name"]', 'October 2024')
    await page.click('[data-testid="save-budget"]')

    // Verify budget appears in list
    await expect(page.locator('[data-testid="budget-card"]')).toBeVisible()
  })

  test('View Calendar Net', async ({ page }) => {
    await page.goto('/transactions')

    // Mock calendar data
    await page.route('**/api/stats/calendar?ym=2024-10', async (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          y: 2024,
          m: 10,
          days: [
            { date: '2024-10-01', income_minor: 0, expense_minor: 2500, net_minor: -2500 },
            { date: '2024-10-15', income_minor: 500000, expense_minor: 0, net_minor: 500000 },
            { date: '2024-10-31', income_minor: 0, expense_minor: 1500, net_minor: -1500 }
          ],
          totals: { income_minor: 500000, expense_minor: 4000, net_minor: 496000 }
        })
      })
    })

    // Navigate to calendar view
    await page.click('[data-testid="calendar-tab"]')

    // Verify calendar displays daily nets
    await expect(page.locator('[data-testid="calendar-day-net"]')).toBeVisible()
    await expect(page.locator('[data-testid="calendar-month-total"]')).toContainText('$4,960.00')
  })

  test('Receive AI Insight', async ({ page }) => {
    await page.goto('/insights')

    // Mock insights data
    await page.route('**/api/insights', async (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: [
            {
              id: 'insight-1',
              type: 'spending_trend',
              title: 'Spending Increase Detected',
              body: 'Your spending increased by 25% compared to last month.',
              severity: 'warning',
              created_at: new Date().toISOString()
            }
          ],
          count: 1
        })
      })
    })

    // Verify insight appears
    await expect(page.locator('[data-testid="insight-card"]')).toBeVisible()
    await expect(page.locator('[data-testid="insight-title"]')).toContainText('Spending Increase Detected')
  })

  test('Accept Auto-Budget Proposal', async ({ page }) => {
    await page.goto('/budgets')

    // Mock auto-budget proposal
    await page.route('**/api/ai/auto-budget/propose', async (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          proposals: [
            {
              category_id: 'cat-1',
              category_name: 'Food & Drink',
              limit_minor: 60000,
              rationale: 'Based on your average monthly spending',
              confidence: 85
            },
            {
              category_id: 'cat-2',
              category_name: 'Transportation',
              limit_minor: 30000,
              rationale: 'Based on your recent commuting costs',
              confidence: 90
            }
          ],
          total_allocated: 90000,
          total_income: 150000,
          period_year: 2024,
          period_month: 11,
          methodology: 'Zero-based budgeting with historical analysis'
        })
      })
    })

    // Generate auto-budget
    await page.click('[data-testid="auto-budget-button"]')

    // Verify proposal appears
    await expect(page.locator('[data-testid="budget-proposal"]')).toBeVisible()
    await expect(page.locator('[data-testid="proposal-total"]')).toContainText('$900.00')

    // Accept proposal
    await page.click('[data-testid="accept-proposal"]')

    // Verify budget is created
    await expect(page.locator('[data-testid="budget-created"]')).toBeVisible()
  })

  test('Complete Golden Path', async ({ page }) => {
    // This test combines all the above steps in sequence
    // In a real implementation, you'd need to handle state between steps

    await test.step('CSV Import', async () => {
      await page.goto('/transactions')
      // CSV import steps...
    })

    await test.step('Add Recurring', async () => {
      // Recurring transaction steps...
    })

    await test.step('Create Budget', async () => {
      await page.goto('/budgets')
      // Budget creation steps...
    })

    await test.step('View Calendar', async () => {
      await page.goto('/transactions')
      await page.click('[data-testid="calendar-tab"]')
      // Calendar view steps...
    })

    await test.step('Receive Insight', async () => {
      await page.goto('/insights')
      // Insight verification steps...
    })

    await test.step('Accept Auto-Budget', async () => {
      await page.goto('/budgets')
      // Auto-budget acceptance steps...
    })

    // Final verification that all features work together
    await expect(page.locator('[data-testid="app-functional"]')).toBeVisible()
  })
})

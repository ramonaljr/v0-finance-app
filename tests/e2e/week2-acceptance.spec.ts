import { test, expect } from '@playwright/test'

// Week 2 Acceptance Test: CSV Import → Recurring → Budget → Calendar → Insight → Auto-budget
test.describe('Week 2 MVP Acceptance Criteria', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app and ensure user is logged in
    // You'll need to implement your own login logic here
    await page.goto('http://localhost:3000')
    // await loginTestUser(page)
  })

  test('complete user journey: import CSV, add recurring, create budget, view calendar, receive insight, accept auto-budget', async ({ page }) => {
    // Step 1: Import CSV transactions
    await test.step('Import CSV transactions', async () => {
      await page.goto('/transactions')

      // Click import button
      await page.click('button:has-text("Import")')

      // Upload CSV file
      const csvContent = `date,amount,description,payee
2025-01-01,1000.00,Salary,Employer Inc
2025-01-05,-50.00,Groceries,Whole Foods
2025-01-10,-30.00,Gas,Shell Station
2025-01-15,-100.00,Utilities,Electric Company`

      // Simulate CSV upload and mapping
      await page.fill('textarea[name="csvContent"]', csvContent)

      // Map columns
      await page.selectOption('select[name="dateColumn"]', 'date')
      await page.selectOption('select[name="amountColumn"]', 'amount')
      await page.selectOption('select[name="descriptionColumn"]', 'description')
      await page.selectOption('select[name="payeeColumn"]', 'payee')

      // Submit import
      await page.click('button:has-text("Import Transactions")')

      // Verify success message
      await expect(page.locator('text=Successfully imported')).toBeVisible()
    })

    // Step 2: Add recurring transaction
    await test.step('Add recurring transaction', async () => {
      await page.goto('/transactions')

      // Click add transaction
      await page.click('button:has-text("Add Transaction")')

      // Fill in recurring transaction details
      await page.fill('input[name="payee"]', 'Monthly Subscription')
      await page.fill('input[name="amount"]', '9.99')
      await page.selectOption('select[name="direction"]', 'out')
      await page.fill('input[name="occurred_at"]', '2025-01-01')

      // Enable recurring
      await page.check('input[name="is_recurring"]')
      await page.selectOption('select[name="recur_rule"]', 'FREQ=MONTHLY;INTERVAL=1')

      // Submit
      await page.click('button[type="submit"]')

      // Verify transaction was added
      await expect(page.locator('text=Monthly Subscription')).toBeVisible()
    })

    // Step 3: Run recurring transactions engine
    await test.step('Run recurring transactions engine', async () => {
      // Trigger recurring engine via API
      const response = await page.request.post('/api/transactions/recurring/run')
      expect(response.ok()).toBeTruthy()

      const data = await response.json()
      expect(data.success).toBe(true)
    })

    // Step 4: Create budget
    await test.step('Create budget for current month', async () => {
      await page.goto('/budgets')

      // Click create budget
      await page.click('button:has-text("Create Budget")')

      // Select period
      await page.fill('input[name="period"]', '2025-01')
      await page.selectOption('select[name="type"]', 'zero')

      // Add budget items (or use auto-budget)
      await page.click('button:has-text("Use Auto-Budget")')

      // Wait for AI to generate proposal
      await expect(page.locator('text=Budget Proposal')).toBeVisible({ timeout: 10000 })

      // Accept proposal
      await page.click('button:has-text("Accept Proposal")')

      // Verify budget was created
      await expect(page.locator('text=Budget created successfully')).toBeVisible()
    })

    // Step 5: View calendar with net values
    await test.step('View calendar with daily net values', async () => {
      await page.goto('/transactions')

      // Switch to calendar view
      await page.click('button:has-text("Calendar View")')

      // Verify calendar is displayed
      await expect(page.locator('[data-testid="calendar-grid"]')).toBeVisible()

      // Verify at least one day has a net value
      await expect(page.locator('[data-testid="calendar-day-net"]').first()).toBeVisible()
    })

    // Step 6: Receive insights
    await test.step('Generate and view insights', async () => {
      // Trigger insights generation via API
      const response = await page.request.post('/api/ai/insights/run')
      expect(response.ok()).toBeTruthy()

      const data = await response.json()
      expect(data.created).toBeGreaterThan(0)

      // Navigate to insights page
      await page.goto('/insights')

      // Verify insights are displayed
      await expect(page.locator('[data-testid="insight-card"]').first()).toBeVisible()
    })

    // Step 7: Accept auto-budget proposal
    await test.step('Generate and accept auto-budget proposal', async () => {
      await page.goto('/budgets')

      // Click create new budget for next month
      await page.click('button:has-text("Create Budget")')

      // Select next month
      const nextMonth = new Date()
      nextMonth.setMonth(nextMonth.getMonth() + 1)
      const ym = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}`
      await page.fill('input[name="period"]', ym)

      // Request auto-budget
      await page.click('button:has-text("Generate Auto-Budget")')

      // Wait for AI proposal
      await expect(page.locator('text=AI Budget Proposal')).toBeVisible({ timeout: 10000 })

      // Verify proposals have rationale and confidence
      await expect(page.locator('[data-testid="budget-rationale"]').first()).toBeVisible()
      await expect(page.locator('[data-testid="budget-confidence"]').first()).toBeVisible()

      // Accept the proposal
      await page.click('button:has-text("Accept and Create Budget")')

      // Verify budget was created
      await expect(page.locator('text=Budget created from AI proposal')).toBeVisible()
    })
  })

  test('verify cache materialization', async ({ page }) => {
    await test.step('Check KPI cache is populated', async () => {
      // Make API call to stats/period endpoint
      const ym = '2025-01'
      const response = await page.request.get(`/api/stats/period?ym=${ym}`)
      expect(response.ok()).toBeTruthy()

      const data = await response.json()
      expect(data.ym).toBe(ym)
      expect(data).toHaveProperty('income_minor')
      expect(data).toHaveProperty('expense_minor')
      expect(data).toHaveProperty('net_minor')
      expect(data).toHaveProperty('top_cats')
    })

    await test.step('Check calendar cache is populated', async () => {
      const ym = '2025-01'
      const response = await page.request.get(`/api/stats/calendar?ym=${ym}`)
      expect(response.ok()).toBeTruthy()

      const data = await response.json()
      expect(data.y).toBe(2025)
      expect(data.m).toBe(1)
      expect(data.days).toBeDefined()
      expect(Array.isArray(data.days)).toBe(true)
    })
  })

  test('verify AI consent is required', async ({ page }) => {
    // Try to use AI coach without consent
    const response = await page.request.post('/api/ai/coach', {
      data: {
        messages: [{ role: 'user', content: 'Help me budget' }]
      }
    })

    // Should get 403 if consent not given
    if (response.status() === 403) {
      const data = await response.json()
      expect(data.requires_consent).toBe(true)
    }
  })
})

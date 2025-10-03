import { test, expect } from '@playwright/test'

/**
 * E2E Test: AI Consent Enforcement
 *
 * Validates that the AI coach endpoint properly enforces consent
 * before allowing access to AI features.
 */

test.describe('AI Consent Enforcement', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3000')
  })

  test('should block AI coach without consent', async ({ page, request }) => {
    // First, login with test user
    await page.goto('http://localhost:3000/auth/login')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'testpassword123')
    await page.click('button[type="submit"]')

    // Wait for redirect after login
    await page.waitForURL(/\/home|\/dashboard/, { timeout: 5000 })

    // Attempt to call AI coach endpoint without consent
    const response = await request.post('http://localhost:3000/api/ai/coach', {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        messages: [
          {
            role: 'user',
            content: 'How can I save more money?',
          },
        ],
      },
    })

    // Verify response is 403 Forbidden
    expect(response.status()).toBe(403)

    const responseBody = await response.json()
    expect(responseBody.error).toContain('consent')
    expect(responseBody.requires_consent).toBe(true)
  })

  test('should allow AI coach after consent granted', async ({ page, request }) => {
    // Login and grant consent
    await page.goto('http://localhost:3000/auth/login')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'testpassword123')
    await page.click('button[type="submit"]')

    await page.waitForURL(/\/home|\/dashboard/, { timeout: 5000 })

    // Navigate to settings and grant AI consent
    await page.goto('http://localhost:3000/setting')

    // Look for AI consent toggle/checkbox
    const consentButton = page.locator('text=/AI.*consent|consent.*AI/i').first()
    if (await consentButton.isVisible()) {
      await consentButton.click()

      // Wait for consent to be saved
      await page.waitForTimeout(1000)
    }

    // Now attempt to call AI coach endpoint
    const response = await request.post('http://localhost:3000/api/ai/coach', {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        messages: [
          {
            role: 'user',
            content: 'Help me budget',
          },
        ],
      },
    })

    // Should succeed (200 or 202)
    expect(response.status()).toBeLessThan(300)

    const responseBody = await response.json()
    expect(responseBody.message).toBeDefined()
    expect(responseBody.usage).toBeDefined()
  })

  test('should show consent prompt on AI coach page', async ({ page }) => {
    // Login without consent
    await page.goto('http://localhost:3000/auth/login')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'testpassword123')
    await page.click('button[type="submit"]')

    await page.waitForURL(/\/home|\/dashboard/, { timeout: 5000 })

    // Navigate to AI coach page
    await page.goto('http://localhost:3000/coach')

    // Should see consent prompt
    const consentPrompt = page.locator('text=/consent|agree|terms/i')
    await expect(consentPrompt.first()).toBeVisible({ timeout: 5000 })
  })

  test('should enforce consent on AI auto-budget endpoint', async ({ page, request }) => {
    // Login without consent
    await page.goto('http://localhost:3000/auth/login')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'testpassword123')
    await page.click('button[type="submit"]')

    await page.waitForURL(/\/home|\/dashboard/, { timeout: 5000 })

    // Attempt to call auto-budget endpoint without consent
    const response = await request.post('http://localhost:3000/api/ai/auto-budget', {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        period_month: new Date().getMonth() + 1,
        period_year: new Date().getFullYear(),
      },
    })

    // Should also require consent
    expect(response.status()).toBe(403)

    const responseBody = await response.json()
    expect(responseBody.error).toContain('consent')
  })
})

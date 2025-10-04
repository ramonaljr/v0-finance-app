/**
 * Safe fetch utility that prevents JSON parsing errors
 * Handles empty responses, non-200 status codes, and JSON parsing failures
 */

export interface FetchOptions extends RequestInit {
  // Add custom options if needed
}

export async function safeFetch<T>(
  url: string,
  options?: FetchOptions
): Promise<T | null> {
  try {
    const response = await fetch(url, options)

    // Check if response is ok (status 200-299)
    if (!response.ok) {
      console.error(
        `Fetch error: ${response.status} ${response.statusText} - ${url}`
      )
      return null
    }

    // Read response as text first to check if it's empty
    const text = await response.text()
    if (!text || text.trim() === '') {
      console.error('Empty response body from:', url)
      return null
    }

    // Parse JSON safely
    try {
      return JSON.parse(text) as T
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Response:', text.slice(0, 100))
      return null
    }
  } catch (error) {
    console.error('Fetch failed:', error)
    return null
  }
}

/**
 * Safe fetch with automatic retry on network failures
 */
export async function safeFetchWithRetry<T>(
  url: string,
  options?: FetchOptions,
  retries = 1
): Promise<T | null> {
  let lastError: Error | null = null

  for (let i = 0; i <= retries; i++) {
    try {
      return await safeFetch<T>(url, options)
    } catch (error) {
      lastError = error as Error
      if (i < retries) {
        // Wait before retry (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 1000))
      }
    }
  }

  console.error('All retries failed:', lastError)
  return null
}

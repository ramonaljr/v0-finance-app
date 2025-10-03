export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const Sentry = await import('@sentry/nextjs')

    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 0.1,
      debug: process.env.NODE_ENV === 'development',
      environment: process.env.NODE_ENV || 'development',
      integrations: [
        Sentry.httpIntegration(),
      ],
    })
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    const Sentry = await import('@sentry/nextjs')

    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 0.1,
      debug: process.env.NODE_ENV === 'development',
      environment: process.env.NODE_ENV || 'development',
    })
  }
}

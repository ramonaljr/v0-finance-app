/**
 * Production-safe logger utility
 * - Logs to console in development
 * - Silent or sends to monitoring service in production
 */

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug'

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private logInternal(level: LogLevel, ...args: any[]) {
    if (this.isDevelopment) {
      console[level](...args)
    } else if (level === 'error') {
      // In production, send errors to monitoring service
      // TODO: Integrate with Sentry or similar
      // Sentry.captureException(args[0])

      // For now, just suppress console output
    }
  }

  info(...args: any[]) {
    this.logInternal('info', ...args)
  }

  warn(...args: any[]) {
    this.logInternal('warn', ...args)
  }

  error(...args: any[]) {
    this.logInternal('error', ...args)
  }

  debug(...args: any[]) {
    this.logInternal('debug', ...args)
  }

  // Alias for compatibility
  log(...args: any[]) {
    this.logInternal('log', ...args)
  }
}

export const logger = new Logger()

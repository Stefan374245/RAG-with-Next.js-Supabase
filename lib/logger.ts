/**
 * Was macht logger.ts?
 *
 * - logger.ts stellt einen zentralen Logging-Service für das gesamte RAG-System bereit.
 * - Einheitliche Log-Ausgabe für Debug, Info, Warnungen und Fehler (inkl. Zeitstempel, Modul, Funktion, Metadaten).
 * - Unterstützt Umgebungsabhängigkeit: Im Development-Modus werden mehr Details geloggt.
 * - Spezielle Methoden für RAG-spezifische Logs (z.B. ragQuery, ragRetrieval, embeddingGenerated).
 * - Wird von allen wichtigen Services (API, Vector-Service, LLM-Service) genutzt, um Fehler, Anfragen und Systemereignisse nachvollziehbar zu machen.
 * - Erleichtert Debugging, Monitoring und Fehleranalyse im gesamten System.
 *
 * Kurz: logger.ts sorgt für nachvollziehbare, strukturierte Logs und ist die zentrale Stelle für alle Konsolen-Ausgaben im Projekt.
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface LogContext {
  module?: string
  function?: string
  metadata?: Record<string, unknown>
}

class Logger {
  private isDevelopment = process.env.NODE_ENV !== 'production'

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: LogContext
  ): string {
    const timestamp = new Date().toISOString()
    const moduleName = context?.module ? `[${context.module}]` : ''
    const functionName = context?.function ? `.${context.function}` : ''
    return `${timestamp} ${level} ${moduleName}${functionName}: ${message}`
  }

  private log(
    level: LogLevel,
    message: string,
    context?: LogContext,
    data?: unknown
  ): void {
    const formattedMessage = this.formatMessage(level, message, context)
    // Immer loggen, auch in Production (zur Fehlersuche)
    if (level === LogLevel.ERROR || level === LogLevel.WARN) {
      console.error(formattedMessage, data || '')
    } else {
      console.log(formattedMessage, data || '')
    }
    if (context?.metadata) {
      console.log('Metadata:', context.metadata)
    }
  }

  debug(message: string, context?: LogContext, data?: unknown): void {
    this.log(LogLevel.DEBUG, message, context, data)
  }

  info(message: string, context?: LogContext, data?: unknown): void {
    this.log(LogLevel.INFO, message, context, data)
  }

  warn(message: string, context?: LogContext, data?: unknown): void {
    this.log(LogLevel.WARN, message, context, data)
  }

  error(message: string, context?: LogContext, error?: Error | unknown): void {
    const metadata = error instanceof Error 
      ? { errorMessage: error.message, stack: error.stack }
      : { error }
    this.log(LogLevel.ERROR, message, {
      ...context,
      metadata: { ...context?.metadata, ...metadata }
    })
  }

  // RAG-specific logging helpers
  ragQuery(query: string, sourcesFound: number): void {
    this.info(
      `RAG Query: "${query.substring(0, 50)}${query.length > 50 ? '...' : ''}"`,
      { 
        module: 'RAG',
        metadata: { sourcesFound, queryLength: query.length }
      }
    )
  }

  ragRetrieval(
    sources: number,
    topSimilarity?: number,
    threshold?: number
  ): void {
    this.info(
      `Retrieved ${sources} source${sources !== 1 ? 's' : ''}`,
      {
        module: 'RAG',
        function: 'retrieval',
        metadata: { 
          count: sources, 
          topSimilarity: topSimilarity ? `${(topSimilarity * 100).toFixed(1)}%` : 'N/A',
          threshold: threshold ? `${(threshold * 100).toFixed(1)}%` : 'N/A'
        }
      }
    )
  }

  embeddingGenerated(dimension: number, inputLength: number): void {
    this.debug(
      `Embedding generated`,
      {
        module: 'RAG',
        function: 'embedding',
        metadata: { dimension, inputLength }
      }
    )
  }
}

export const logger = new Logger()

// Test-Log beim Import (nur zu Debugzwecken, kann wieder entfernt werden)
logger.info("Logger initialized", { module: "Logger" })

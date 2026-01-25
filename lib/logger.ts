/**
 * Centralized Logging Service
 * Provides consistent logging across the RAG system
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

    switch (level) {
      case LogLevel.DEBUG:
        if (this.isDevelopment) {
          console.log(formattedMessage, data || '')
        }
        break
      case LogLevel.INFO:
        console.log(formattedMessage, data || '')
        break
      case LogLevel.WARN:
        console.warn(formattedMessage, data || '')
        break
      case LogLevel.ERROR:
        console.error(formattedMessage, data || '')
        if (context?.metadata) {
          console.error('Metadata:', context.metadata)
        }
        break
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

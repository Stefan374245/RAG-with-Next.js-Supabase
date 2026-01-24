'use server'

import { storeDocument } from '../../features/rag-chat/services/vector-service'
import { APP_CONFIG } from '../../lib/constants'

/**
 * Server Action for document ingestion
 * Chunks text and stores with embeddings in Supabase
 * 
 * React 19 Server Action - demonstrates type-safe server calls
 * without manual API route creation
 */

export interface IngestResult {
  success: boolean
  message: string
  chunksCreated?: number
  error?: string
}

/**
 * Simple text chunking by character count
 * For production, consider token-based chunking with tiktoken
 */
function chunkText(text: string, chunkSize: number = APP_CONFIG.CHUNK_SIZE, overlap: number = APP_CONFIG.CHUNK_OVERLAP): string[] {
  const chunks: string[] = []
  let start = 0

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length)
    chunks.push(text.slice(start, end))
    start = end - overlap
    
    // Prevent infinite loop
    if (start >= text.length) break
  }

  return chunks
}

/**
 * Ingest a document into the knowledge base
 * Automatically chunks content and generates embeddings
 */
export async function ingestDocument(
  title: string,
  content: string,
  metadata?: Record<string, unknown>
): Promise<IngestResult> {
  try {
    // Validate input
    if (!title || !content) {
      return {
        success: false,
        message: 'Titel und Inhalt sind erforderlich',
        error: 'INVALID_INPUT'
      }
    }

    if (content.length < 50) {
      return {
        success: false,
        message: 'Inhalt muss mindestens 50 Zeichen lang sein',
        error: 'CONTENT_TOO_SHORT'
      }
    }

    // Chunk the content
    const chunks = chunkText(content)

    if (chunks.length === 0) {
      return {
        success: false,
        message: 'Fehler beim Chunking des Inhalts',
        error: 'CHUNKING_FAILED'
      }
    }

    // Store each chunk with embeddings
    const storePromises = chunks.map((chunk, index) =>
      storeDocument(
        `${title} (Teil ${index + 1}/${chunks.length})`,
        chunk,
        {
          ...metadata,
          originalTitle: title,
          chunkIndex: index,
          totalChunks: chunks.length,
        }
      )
    )

    await Promise.all(storePromises)

    return {
      success: true,
      message: `Dokument erfolgreich gespeichert (${chunks.length} Chunks)`,
      chunksCreated: chunks.length,
    }
  } catch (error) {
    console.error('Ingest document error:', error)
    return {
      success: false,
      message: 'Fehler beim Speichern des Dokuments',
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

/**
 * Batch ingest multiple documents
 */
export async function ingestBatch(
  documents: Array<{
    title: string
    content: string
    metadata?: Record<string, unknown>
  }>
): Promise<IngestResult> {
  try {
    const results = await Promise.all(
      documents.map(doc => ingestDocument(doc.title, doc.content, doc.metadata))
    )

    const successCount = results.filter(r => r.success).length
    const totalChunks = results.reduce((sum, r) => sum + (r.chunksCreated || 0), 0)

    return {
      success: successCount === documents.length,
      message: `${successCount}/${documents.length} Dokumente gespeichert (${totalChunks} Chunks)`,
      chunksCreated: totalChunks,
    }
  } catch (error) {
    console.error('Batch ingest error:', error)
    return {
      success: false,
      message: 'Fehler beim Batch-Import',
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    }
  }
}

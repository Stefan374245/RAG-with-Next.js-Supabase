/**
 * Was macht utils.ts?
 *
 * - Enthält kleine, wiederverwendbare Hilfsfunktionen ("Utilities") für das gesamte Projekt.
 * - Beispiele:
 *   - cn(...): Kombiniert und dedupliziert Tailwind CSS-Klassen (mit clsx und tailwind-merge)
 *   - generateSessionId(): Erzeugt eine zufällige Sitzungs-ID (UUID)
 *   - formatTimestamp(): Formatiert ein Datum für die Anzeige (z.B. Uhrzeit)
 * - Wird überall dort genutzt, wo solche Hilfsfunktionen gebraucht werden (UI, Chat, Logging, etc.).
 *
 * Kurz: utils.ts ist die zentrale Sammlung von kleinen, nützlichen Funktionen, die das Projekt an vielen Stellen braucht.
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { APP_CONFIG } from './constants'


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a random session ID for anonymous users
 */
export function generateSessionId(): string {
  return crypto.randomUUID()
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

/**
 * splitTextIntoChunks: Teilt einen langen Text in überlappende Chunks (Standard: 512 Token, 50 Overlap)
 * - Nutzt Wortanzahl als Approximation für Token (für OpenAI-Embeddings ausreichend)
 * - Gibt ein Array von Strings zurück, jeder String ist ein Chunk
 */
export function splitTextIntoChunks(
  text: string,
  chunkSize: number = APP_CONFIG.CHUNK_SIZE,
  chunkOverlap: number = APP_CONFIG.CHUNK_OVERLAP
): string[] {
  if (!text || text.length === 0) return [];
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let start = 0;
  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);
    const chunk = words.slice(start, end).join(' ');
    chunks.push(chunk);
    if (end === words.length) break;
    start += chunkSize - chunkOverlap;
  }
  return chunks;
}

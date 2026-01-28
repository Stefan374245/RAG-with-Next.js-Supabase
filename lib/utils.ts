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


/**
 * Merges multiple class values into a single string, handling conditional and array-based class names.
 * Utilizes `clsx` for class name composition and `twMerge` for Tailwind CSS class deduplication.
 *
 * @param inputs - An array of class values (strings, arrays, or objects) to be merged.
 * @returns A single string of merged class names with Tailwind CSS classes deduplicated.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a random session ID for anonymous users
 * @returns UUID string
 */
export function generateSessionId(): string {
  return crypto.randomUUID()
}

/**
 * Format timestamp for display
 * @param date Date object
 * @returns Formatted time string (HH:MM)
 */
export function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

/**
 * splitTextIntoChunks: Teilt einen langen Text in überlappende Chunks und nutzt die in constants.ts definierten Standardwerte.
 *
 * - Nützlich für die Verarbeitung langer Texte, z.B. beim Erzeugen von Embeddings oder bei der semantischen Suche.
 * - Teilt den Text in Chunks der angegebenen Größe (chunkSize) mit einer Überlappung (chunkOverlap).
 *
 * @param text          Der lange Text, der in Chunks aufgeteilt werden soll.
 * @param chunkSize     Die gewünschte Größe jedes Chunks (Standard: APP_CONFIG.CHUNK_SIZE).
 * @param chunkOverlap  Die Anzahl der Wörter, die sich zwischen aufeinanderfolgenden Chunks überlappen (Standard: APP_CONFIG.CHUNK_OVERLAP).
 * @returns             Ein Array von Text-Chunks.
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

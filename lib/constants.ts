/**
 * Was macht constants.ts?
 *
 * - Enthält zentrale Konfigurationswerte für das gesamte RAG-System (APP_CONFIG).
 * - Hier werden alle wichtigen Parameter (z.B. Thresholds, Limits, Embedding-Größe, LLM-Settings, Debug-Flags) an einer Stelle gepflegt.
 * - Die Werte werden aus Umgebungsvariablen (.env.local) geladen oder sind fest im Code gesetzt.
 * - Die Funktion validateConfig() prüft beim Start, ob alle nötigen Umgebungsvariablen gesetzt sind.
 * - Wird von allen Modulen genutzt, die auf globale Einstellungen zugreifen müssen (z.B. vector-service, API, Seeder).
 *
 * Kurz: constants.ts ist die zentrale Schaltstelle für alle System-Konstanten und sorgt für einheitliche Konfiguration.
 */

/**
 * Was bedeutet "Threshold" im RAG-System?
 *
 * - Ein Threshold (Schwellenwert) legt fest, ab welcher Ähnlichkeit ein Dokument als relevant gilt.
 * - Im Kontext von Vektor-Suche (semantic search) ist das der minimale Wert, den die Ähnlichkeit (z.B. Cosine Similarity) zwischen Query-Embedding und Dokument-Embedding erreichen muss, damit das Dokument als "Treffer" zurückgegeben wird.
 * - Beispiel: MATCH_THRESHOLD = 0.3 → Nur Dokumente mit Ähnlichkeit >= 0.3 werden als Quellen verwendet.
 * - Ein niedriger Threshold liefert mehr, aber ggf. weniger relevante Ergebnisse. Ein hoher Threshold liefert weniger, aber sehr ähnliche Ergebnisse.
 * - Die Einstellung beeinflusst direkt die Qualität und Präzision der Antworten des Systems.
 *
 * Kurz: Der Threshold filtert irrelevante Dokumente aus der Wissensdatenbank und steuert, wie "streng" die Suche ist.
 */

export const APP_CONFIG = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,

  MATCH_THRESHOLD: 0.3,
  MATCH_COUNT: 5,
  CHUNK_SIZE: 512,
  CHUNK_OVERLAP: 50,
  EMBEDDING_DIMENSION: 1536,
  TEMPERATURE: 0.3,
  MAX_TOKENS: 1000,
  THROTTLE_DELAY: 3000,
  MAX_MESSAGE_LENGTH: 500,

  DEBUG_MODE: process.env.NODE_ENV !== "production",
} as const;


export function validateConfig(): void {
  const required = ["NEXT_PUBLIC_SUPABASE_URL", "OPENAI_API_KEY"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
}

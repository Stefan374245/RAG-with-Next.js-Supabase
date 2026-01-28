/**
 * Zusammenhang supabase.ts im System:
 *
 * - Diese Datei initialisiert die Supabase-Clients für den Zugriff auf die Postgres-Datenbank.
 * - Es gibt zwei Clients:
 *   1. supabase: Für Browser/Client (nutzt den anon key, respektiert Row Level Security)
 *   2. supabaseAdmin: Für Server (nutzt den Service Role Key, umgeht RLS – nur für sichere Server-Operationen!)
 * - Wird von allen Services genutzt, die auf die Datenbank zugreifen (z.B. vector-service.ts für Embedding-Suche/Speichern).
 * - Die Umgebungsvariablen werden aus .env.local geladen.
 * - Ohne diese Datei könnten API-Routen, Seeder und Retrieval nicht mit der Wissensdatenbank kommunizieren.
 *
 * Kurz: supabase.ts ist die zentrale Schnittstelle zwischen eurem Code und der Supabase-Datenbank.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

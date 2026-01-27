/**
 * Warum gibt es den lib-Ordner und openai.ts?
 *
 * - Der Ordner lib/ enthält zentrale, wiederverwendbare "Library"-Module für das gesamte Projekt.
 * - Hier liegen Integrationen und Basiskonfigurationen, die von vielen Features/Services genutzt werden (z.B. OpenAI, Supabase, Logger).
 * - openai.ts kapselt die Initialisierung/Konfiguration der OpenAI-Modelle (z.B. Embedding- und Chat-Modelle).
 * - Vorteil: Nur an einer Stelle ändern, überall konsistent nutzen.
 * - Im Gegensatz dazu liegen im services/-Ordner die eigentlichen Anwendungs-Services (z.B. vector-service.ts), die auf diese Basismodule zugreifen.
 * - Trennung: lib/ = Infrastruktur & Integrationen, services/ = Business-Logik & Feature-Services.
 *
 * Kurz: lib/openai.ts ist die zentrale OpenAI-Schnittstelle für das ganze Projekt – services nutzen sie, aber konfigurieren sie nicht selbst.
 */

import { openai } from '@ai-sdk/openai'

export const embeddingModel = openai.embedding('text-embedding-3-small')

export const chatModel = openai('gpt-4-turbo')

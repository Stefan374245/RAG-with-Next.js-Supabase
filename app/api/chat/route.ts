/**
 * 🚦 route.ts Cheat Sheet (Chat API mit RAG)
 * 
 * Ablauf:
 * 1. POST-Request mit { messages: [{role, content}, ...] }
 * 2. parseRequest: Validiert und normalisiert Nachrichten (nur "user" & "assistant" erlaubt)
 * 3. buildSearchQuery: Baut Query aus letzten Nachrichten für semantische Suche
 * 4. retrieveSources: Sucht relevante Wissensquellen (Supabase/Vector-DB)
 * 5. buildRAGPrompt: Erstellt System-Prompt mit Kontext aus Quellen
 * 6. generateStreamResponse: Streamt LLM-Antwort (mit vollständigem Chat-Verlauf)
 * 7. Antwort: Stream + Debug-Header (X-RAG-Sources, X-RAG-Query)
 * 
 * Fehler:
 * - 400: Fehlende/Leere Nachrichten
 * - 500: Interner Fehler (mit Log)
 * 
 * Wichtig:
 * - Nur "user" und "assistant" Rollen werden akzeptiert
 * - Query für Suche und Header wird auf ASCII limitiert
 * - Prompt-Logik und Retrieval strikt getrennt
 */

import { streamText, type CoreMessage } from "ai";
import { chatModel } from "../../../lib/openai";
import { searchKnowledge } from "../../../features/rag-chat/services/vector-service";
import { buildRAGPrompt } from "../../../features/rag-chat/services/llm-service";
import { logger } from "../../../lib/logger";
import { supabaseAdmin } from "../../../lib/supabase";

export const runtime = "nodejs";

type AllowedRole = "user" | "assistant";

type LLMMessage =
  | { role: "user"; content: string }
  | { role: "assistant"; content: string };

/**
 * Parst und validiert die eingehende Chat-Anfrage.
 *
 * @param req - Die eingehende HTTP-Anfrage mit einem JSON-Body, der Chat-Nachrichten enthält.
 * @returns Ein Objekt mit den normalisierten Nachrichten und dem Inhalt der letzten Benutzer-Nachricht.
 * @throws {Error} Falls das Nachrichten-Array fehlt, leer ist oder ungültige Einträge enthält.
 *
 * Die Funktion erwartet, dass der Request-Body ein `messages`-Array enthält, wobei jede Nachricht folgende Eigenschaften haben muss:
 * - Eine `role`-Eigenschaft vom Typ string, die einen der folgenden Werte haben muss: "user" oder "assistant".
 * - Eine `content`-Eigenschaft vom Typ string.
 *
 * Die Funktion gibt zurück:
 * - `messages`: Ein Array der normalisierten und validierten Nachrichten.
 * - `userMessage`: Den Inhalt der letzten Nachricht im Array.
 */
async function parseRequest(req: Request) {
  const body = await req.json();
  const messages = body?.messages;
  if (!messages || messages.length === 0) {
    throw new Error("Missing messages");
  }
  const allowedRoles: AllowedRole[] = ["user", "assistant"];
  const normalizedMessages: LLMMessage[] = messages.map((m: any) => {
    if (!m.role || typeof m.role !== "string") {
      throw new Error("Each message must have a valid role");
    }
    if (typeof m.content !== "string") {
      throw new Error("Each message must have content");
    }
    if (!allowedRoles.includes(m.role)) {
      throw new Error(`Invalid role: ${m.role}`);
    }
    return {
      role: m.role,
      content: m.content,
    };
  });
  const userMessage =
    normalizedMessages[normalizedMessages.length - 1]?.content || "";
  if (!userMessage) {
    throw new Error("Empty message");
  }
  return { messages: normalizedMessages, userMessage };
}

/**
 * Erstellt eine Suchanfrage aus den letzten Nachrichten.
 *
 * Extrahiert bis zu die letzten 6 Nachrichten, schneidet deren Inhalt, filtert leere Werte heraus
 * und verbindet sie mit einem Gedankenstrich. Falls kein aktueller Inhalt gefunden wird,
 * wird auf den Inhalt der letzten Nachricht oder einen leeren String zurückgegriffen.
 *
 * @param messages - Ein Array von Nachrichtenobjekten, jeweils optional mit `role` und `content`.
 * @returns Ein String, der die zusammengefassten Inhalte der letzten Nachrichten für die Suche darstellt.
 */
function buildSearchQuery(messages: LLMMessage[]) {
  const recent = messages
    .slice(-6)
    .map((m) => (m?.content || "").trim())
    .filter(Boolean)
    .join(" - ");
  return recent || messages[messages.length - 1]?.content || "";
}

/**
 * Ruft relevante Quellen basierend auf den bereitgestellten LLM-Nachrichten ab.
 *
 * Baut eine Suchanfrage aus den gegebenen Nachrichten auf und sucht anschließend
 * nach passenden Wissensquellen. Falls keine Quellen gefunden werden, wird eine
 * Warnung im Logger ausgegeben.
 *
 * @param messages - Ein Array von LLMMessage-Objekten, die als Grundlage für die Suchanfrage dienen.
 * @returns Ein Promise, das ein Objekt mit den gefundenen Quellen (`sources`) und der verwendeten Suchanfrage (`query`) enthält.
 */
async function retrieveSources(messages: LLMMessage[]) {
  const query = buildSearchQuery(messages);
  let sources: any[] = [];
  try {
    sources = await searchKnowledge(query);
  } catch (err) {
    logger.error(
      "searchKnowledge failed (DB-Zugriff oder Embedding-Problem)",
      { module: "ChatAPI", function: "retrieveSources", metadata: { query } },
      err
    );
    // Fehler weiterwerfen, damit POST darauf reagieren kann
    throw new Error("Knowledge base not reachable or embedding error");
  }
  logger.info(
    `DB-Sources found: ${sources.length} | Titles: ${sources.map(s => s.title).join(", ")}`,
    { module: "ChatAPI", function: "retrieveSources" }
  );
  if (sources.length === 0) {
    logger.warn("No sources found for query", {
      module: "ChatAPI",
      metadata: { query: query.substring(0, 200) },
    });
  }
  return { sources, query };
}

/**
 * Generiert eine Streaming-Antwort vom Sprachmodell basierend auf dem bereitgestellten System-Prompt und den Nachrichten.
 *
 * @param systemPrompt - Der System-Prompt, der das Verhalten des Sprachmodells steuert.
 * @param messages - Ein Array von LLMMessage-Objekten, die den bisherigen Gesprächsverlauf darstellen.
 * @returns Ein Promise, das die Streaming-Textantwort des Sprachmodells liefert.
 */
async function generateStreamResponse(
  systemPrompt: string,
  messages: LLMMessage[],
) {
  return streamText({
    model: chatModel,
    system: systemPrompt,
    messages,
    temperature: 0.3,
    maxTokens: 1000,
  });
}

/**
 * Verarbeitet POST-Anfragen für den Chat-Endpunkt.
 *
 * Diese Funktion nimmt eine Request entgegen, extrahiert die Chat-Nachrichten und die Benutzeranfrage,
 * führt eine Retrieval-Augmentation (RAG) durch, generiert eine Antwort als Stream und gibt diese zurück.
 * Zusätzlich werden Debug-Header mit den verwendeten Quellen und der abgeleiteten Query gesetzt.
 *
 * Fehlerbehandlung:
 * - Gibt einen 400-Status zurück, wenn Nachrichten fehlen oder leer sind.
 * - Gibt einen 500-Status mit Fehlermeldung zurück, falls ein unerwarteter Fehler auftritt.
 *
 * @param req Die eingehende Request vom Typ `Request`.
 * @returns Eine Response mit dem generierten Antwort-Stream und Debug-Headern.
 */
export async function POST(req: Request) {
  try {
    const { messages, userMessage } = await parseRequest(req);

    logger.ragQuery(userMessage, 0);

    // Retrieval using conversation-based query
    const { sources, query } = await retrieveSources(messages);

    // Debug: Wenn keine Quellen gefunden, liefere sie im Body zurück (nur DEV!)
    if (process.env.NODE_ENV !== "production" && sources.length === 0) {
      return new Response(
        JSON.stringify({
          debug: true,
          query,
          sources,
          message: "Keine Quellen gefunden, obwohl DB-Zugriff erfolgreich war.",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Augmentation
    const systemPrompt = buildRAGPrompt(userMessage, sources);
    // Generation (stream) using the full messages array
    const result = await generateStreamResponse(systemPrompt, messages);

    const response = result.toDataStreamResponse();
    response.headers.set("X-RAG-Sources", sources.length.toString());
    const safeQuery = (query || "")
      .replace(/[\r\n]+/g, " ")
      .replace(/[^\x20-\x7E]+/g, "")
      .substring(0, 200);
    response.headers.set("X-RAG-Query", safeQuery);

    return response;
  } catch (error) {
    // Fehlerausgabe für DB-Probleme
    if (
      error instanceof Error &&
      (error.message === "Missing messages" ||
        error.message === "Empty message")
    ) {
      return new Response(error.message, { status: 400 });
    }
    if (
      error instanceof Error &&
      error.message === "Knowledge base not reachable or embedding error"
    ) {
      return new Response(
        JSON.stringify({
          error: "Knowledge base not reachable",
          message: "Supabase-Konfiguration oder Embedding-Generierung fehlerhaft. Prüfe .env.local und Seed-Prozess.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    logger.error("Chat API request failed", { module: "ChatAPI" }, error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

// Direkt nach Import: Prüfe Supabase-Konfiguration
if (!supabaseAdmin) {
  logger.error("Supabase Admin Client is NOT initialized! Check SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL.", { module: "ChatAPI" });
}

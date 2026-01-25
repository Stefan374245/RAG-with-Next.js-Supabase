import { supabase } from '../../../lib/supabase'

export interface ChatMessage {
  id: string
  session_id: string
  message: string
  role: 'user' | 'assistant'
  sources?: any[]
  created_at: string
}

export interface ChatSession {
  session_id: string
  last_message: string
  created_at: string
  message_count: number
}

/**
 * Chat History Service
 * Manages chat history persistence in Supabase
 */
export class ChatHistoryService {
  /**
   * Save a message to chat history
   */
  static async saveMessage(
    sessionId: string,
    message: string,
    role: 'user' | 'assistant',
    sources?: any[]
  ): Promise<ChatMessage | null> {
    try {
      const { data, error } = await supabase
        .from('chat_history')
        .insert({
          session_id: sessionId,
          message,
          role,
          sources: sources || null,
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error saving message:', error)
      return null
    }
  }

  /**
   * Load all messages for a session
   */
  static async loadSession(sessionId: string): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error loading session:', error)
      return []
    }
  }

  /**
   * Get all chat sessions (for sidebar history)
   */
  static async getAllSessions(): Promise<ChatSession[]> {
    try {
      const { data, error } = await supabase
        .from('chat_history')
        .select('session_id, message, created_at')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Group by session_id and get the latest message for each
      const sessionMap = new Map<string, ChatSession>()
      
      data?.forEach((row: any) => {
        if (!sessionMap.has(row.session_id)) {
          sessionMap.set(row.session_id, {
            session_id: row.session_id,
            last_message: row.message.substring(0, 50) + '...',
            created_at: row.created_at,
            message_count: 1
          })
        } else {
          const session = sessionMap.get(row.session_id)!
          session.message_count++
        }
      })

      return Array.from(sessionMap.values())
    } catch (error) {
      console.error('Error getting sessions:', error)
      return []
    }
  }

  /**
   * Delete a session
   */
  static async deleteSession(sessionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('chat_history')
        .delete()
        .eq('session_id', sessionId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting session:', error)
      return false
    }
  }

  /**
   * Generate a new session ID
   */
  static generateSessionId(): string {
    return crypto.randomUUID()
  }
}

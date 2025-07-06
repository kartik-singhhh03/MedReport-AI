export interface Database {
  public: {
    Tables: {
      reports: {
        Row: {
          id: string
          user_id: string
          filename: string
          file_url: string
          file_type: string
          status: 'processing' | 'completed' | 'failed'
          technical_analysis: string | null
          layman_explanation_en: string | null
          layman_explanation_hi: string | null
          recommendations: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          filename: string
          file_url: string
          file_type: string
          status?: 'processing' | 'completed' | 'failed'
          technical_analysis?: string | null
          layman_explanation_en?: string | null
          layman_explanation_hi?: string | null
          recommendations?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          filename?: string
          file_url?: string
          file_type?: string
          status?: 'processing' | 'completed' | 'failed'
          technical_analysis?: string | null
          layman_explanation_en?: string | null
          layman_explanation_hi?: string | null
          recommendations?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          theme: 'light' | 'dark' | 'system' | null
          language: 'en' | 'hi' | null
          accessibility_mode: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          theme?: 'light' | 'dark' | 'system' | null
          language?: 'en' | 'hi' | null
          accessibility_mode?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          theme?: 'light' | 'dark' | 'system' | null
          language?: 'en' | 'hi' | null
          accessibility_mode?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
  }
}
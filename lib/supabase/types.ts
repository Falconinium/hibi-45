/**
 * Supabase database types.
 *
 * This file mirrors the shape declared in supabase/migrations/0001_init.sql
 * and is hand-written for now. Once we wire up `supabase gen types typescript`
 * in CI we can replace this with the auto-generated file.
 */

export type Database = {
  public: {
    Tables: {
      programs: {
        Row: {
          user_id: string;
          started_on: string;
          timezone: string;
          current_day: number;
          status: 'active' | 'completed' | 'reset';
          reset_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          started_on: string;
          timezone: string;
          current_day?: number;
          status?: 'active' | 'completed' | 'reset';
          reset_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['programs']['Insert']>;
        Relationships: [];
      };
      completions: {
        Row: {
          user_id: string;
          day_number: number;
          challenge_index: number;
          completed_at: string;
        };
        Insert: {
          user_id: string;
          day_number: number;
          challenge_index: number;
          completed_at?: string;
        };
        Update: Partial<Database['public']['Tables']['completions']['Insert']>;
        Relationships: [];
      };
      resets: {
        Row: {
          id: string;
          user_id: string;
          failed_day: number;
          occurred_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          failed_day: number;
          occurred_at?: string;
        };
        Update: Partial<Database['public']['Tables']['resets']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

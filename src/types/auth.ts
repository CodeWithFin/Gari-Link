import type { User as SupabaseUser } from '@supabase/supabase-js';

export type User = SupabaseUser;

export interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  display_name: string;
}

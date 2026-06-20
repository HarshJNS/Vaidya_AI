import { createClient } from '@supabase/supabase-js'
import { hasSupabaseConfig } from './auth'

export const isSupabaseConfigured = hasSupabaseConfig()

export const supabase = isSupabaseConfigured
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  : null

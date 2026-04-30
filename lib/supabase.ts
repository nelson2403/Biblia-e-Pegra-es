import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
    _client = createClient(url, key, {
      auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true },
    })
  }
  return _client
}

// Lazy proxy: createClient is only called on first actual use, not at module import time.
// This prevents build failures when env vars are not yet available.
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop: string) {
    return (getClient() as any)[prop]
  },
})

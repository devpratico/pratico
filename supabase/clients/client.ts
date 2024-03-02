import { createBrowserClient } from '@supabase/ssr'
import { Database } from '../types/database.types'


/**
 * Create a new Supabase Client that can be used client-side (client components)
 */
export default function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
} 
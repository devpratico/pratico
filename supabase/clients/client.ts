import { createBrowserClient } from '@supabase/ssr'


/**
 * Create a new Supabase Client that can be used client-side (client components)
 */
export default function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
import { NextResponse } from 'next/server'
import getSupabaseClient from '@/supabase/clients/old_getSupabaseClient'
import logger from '@/app/_utils/logger'


/**
 * This route is used to handle the callback from the OAuth provider (like sign in with Google).
 * See https://supabase.com/docs/guides/auth/server-side/oauth-with-pkce-flow-for-ssr
 */
export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // If "next" is in params, we'll redirect to it
    const next = searchParams.get('next') ?? '/capsules'

    logger.log('supabase:auth', `GET /api/auth/callback - code: ${code}, next: ${next}, origin: ${origin}`)

    if (code) {
        logger.log('supabase:auth', 'Exchanging code for session', code)
        const supabase = await getSupabaseClient()
        try {
            const { error } = await supabase.auth.exchangeCodeForSession(code)
            if (!error) {
                logger.log('supabase:auth', 'OK - Code exchanged for session', code)
                return NextResponse.redirect(`${origin}${next}`)
            }

        } catch (error) {
            logger.error('supabase:auth', 'Error not put in {error} exchanging code for session:', `"${error}"`)
        }
        

    }
    
    // If no code or error, redirect to login page
    logger.error('supabase:auth', 'Error exchanging code for session', code)
    return NextResponse.redirect(`${origin}`) // Add a path to an error page
}
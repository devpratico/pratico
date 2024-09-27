import { type EmailOtpType } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import createClient from '@/supabase/clients/server'
import logger from '@/app/_utils/logger'


/**
 * This route is called by the link sent to the user's email after they requested a password reset.
 * It authenticates the user thanks to the OTP token and redirects them to the change password page.
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const redirectTo = new URL('/auth?authTab=change-password', request.url)

    if (token_hash && type) {
        const supabase = createClient()
        const { error } = await supabase.auth.verifyOtp({type, token_hash})

        if (!error) {
            logger.log('supabase:auth', 'api/auth - OTP verified - redirecting to', redirectTo.toString())
            NextResponse.json({msg: redirectTo})
            return NextResponse.redirect(redirectTo)

        } else {
            logger.error('supabase:auth', 'api/auth - OTP verification failed')
            return NextResponse.json({msg: error, redirectTo})
        } 

    } else {
        logger.error('supabase:auth', 'api/auth - No token_hash or type')
        return NextResponse.json({msg: 'No token_hash or type'})
    }
}
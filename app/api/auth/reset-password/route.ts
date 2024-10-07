import logger from "@/app/_utils/logger"
import { NextRequest, NextResponse } from "next/server"
import createClient from '@/supabase/clients/server'


export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
        logger.error('supabase:auth', 'api/auth/reset-password - No email provided')
        return NextResponse.json({error: 'No email provided'}, {status: 400})
    }

    logger.log('supabase:auth', 'Resetting password for email', email)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email)

    if (error) {
        logger.log('supabase:auth', 'Error resetting password', error?.message)
        return NextResponse.json({error: 'Supabase error: ' + error?.message}, {status: 500})
    }

    return NextResponse.json({msg: 'Email sent'}, {status: 200})
}
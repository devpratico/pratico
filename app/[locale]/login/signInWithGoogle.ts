/**
 * Sign in with Google
 * This cannot be a server action, thus the client supabase client.
 */
'use client'
import createClient from "@/supabase/clients/client"
import logger from "@/app/_utils/logger"


interface SignInWithGoogleArgs {
    redirectTo?: string
}

export default async function signInWithGoogle(args?: SignInWithGoogleArgs) {
    const supabase = createClient()

    logger.log('supabase:auth', 'Signing in with Google. Redirect to:', args?.redirectTo)

    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: args?.redirectTo,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        })

        if (error) {
            throw error
        }

    } catch (error) {
        throw error
    }

    //revalidatePath('/', 'layout')

}
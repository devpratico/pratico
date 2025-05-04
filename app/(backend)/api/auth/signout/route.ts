import createClient from "@/supabase/clients/server"
import logger from "@/app/_utils/logger"
import { revalidatePath } from "next/cache"


export async function POST() {

    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
        logger.error('supabase:auth', 'Error signing out', error.message)
        return new Response('Error signing out: ' + error.message, { status: 500 })
    }
    revalidatePath('/', 'layout')
    return new Response('Signed out', { status: 200 })
}
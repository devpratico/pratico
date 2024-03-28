import { fetchUserId } from '@/supabase/services/auth'
import { saveCapsule } from '@/supabase/services/capsules'
import { randomUUID } from 'crypto'


// TODO: Put this in a server action?

/**
 * This is the route for creating a new capsule.
 * It creates a new capsule, put it in supabase,
 * and redirects to the new capsule's page.
 * (The snapshot is not created here, but in the RemoteCanvas component.)
 */
export async function GET() {

    let user_id: string
    try {
         user_id = await fetchUserId()

    } catch (error) {        
        // If the user is not logged in, we'll use a local storage capsule 
        const capsule_id = randomUUID()
        const url = '/capsule/' + capsule_id + '?local=true'
        return new Response(null, { status: 302, headers: { Location: url } })
    }

    try {
        const capsuleReturn = await saveCapsule({ created_by: user_id })
        const capsule_id = capsuleReturn.id
        return new Response(null, { status: 302, headers: { Location: '/capsule/' + capsule_id } })

    } catch (error) {
        return new Response("Error creating capsule", { status: 500 })
    }
}
import { redirect } from 'next/navigation'
import { fetchUserId } from '@/supabase/services/auth'
import { saveCapsule } from '@/supabase/services/capsules'


// TODO: Put this in a server action?

/**
 * This is the route for creating a new capsule.
 * It creates a new capsule, put it in supabase,
 * and redirects to the new capsule's page.
 * The snapshot is not created here, but in the RemoteCanvas component.
 */
export async function GET() {

    let user_id: string
    try {
         user_id = await fetchUserId()
    } catch (error) {
        console.error("Error fetching user", error)
        return new Response("Error fetching user", { status: 500 })
    }

    const capsuleData = { created_by: user_id}

    try {
        const capsuleReturn = await saveCapsule(capsuleData)
        const capsule_id = capsuleReturn.id
        return redirect('/capsule/' + capsule_id)
    } catch (error) {
        console.error("Error creating capsule", error)
        return new Response("Error creating capsule", { status: 500 })
    }
}
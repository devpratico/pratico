import { redirect } from 'next/navigation'
import { randomUUID } from 'crypto'
import { fetchUserId } from '@/supabase/services/auth'
import { saveCapsule } from '@/supabase/services/capsules'


// TODO: Put this in a server action

/**
 * This is the route for creating a new capsule.
 * It creates a new capsule, put it in supabase,
 * and redirects to the new capsule's page.
 * The snapshot is not created here, but in the RemoteCanvas component.
 */
export async function GET() {
    const user_id = await fetchUserId()
    const capsule_id = randomUUID()

    const capsule = {
        id: capsule_id,
        created_by: user_id,
    }

    try {
        await saveCapsule(capsule)
    } catch (error) {
        console.error("Error creating capsule", error)
        return new Response("Error creating capsule", { status: 500 })
    }

    return redirect('capsule/' + capsule_id)
}
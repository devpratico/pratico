import { redirect } from 'next/navigation'
import { randomUUID } from 'crypto'
import { getUserId } from '@/supabase/services/auth'
import { setCapsule } from '@/supabase/services/capsules'


/**
 * This is the route for creating a new capsule.
 * It creates a new capsule, put it in supabase,
 * and redirects to the new capsule's page.
 * The snapshot is not created here, but in the RemoteCanvas component.
 */
export async function GET() {
    const user_id = await getUserId()
    const capsule_id = randomUUID()

    const capsule = {
        id: capsule_id,
        created_by: user_id,
    }

    try {
        await setCapsule(capsule)
    } catch (error) {
        console.error("Error creating capsule", error)
        return new Response("Error creating capsule", { status: 500 })
    }

    return redirect('capsule/' + capsule_id)
}
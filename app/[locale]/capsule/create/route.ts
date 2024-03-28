import { fetchUserId } from '@/supabase/services/auth'
import { saveCapsule } from '@/supabase/services/capsules'
import { randomUUID } from 'crypto'


// TODO: Put this in a server action?

/**
 * This is the route for creating a new capsule.
 * It creates a new empty capsule, and redirects to the new capsule's page.
 */
export async function GET(request: Request) {

    // Check if we called this route with a query parameter to load a default capsule
    // For example, we can call capsule/create?loadDefault=demo1 to create a new capsule with the demo1 content
    const { searchParams } = new URL(request.url)
    const loadDefault = searchParams.get('loadDefault')

    // Check if the user is logged in
    let user_id: string | null = null
    try { 
        user_id = await fetchUserId()
    } catch (error) {
        // No user found
    }

    // If the user is logged in, we'll create a new capsule in the database
    if (user_id) {
        try {
            const newCapsule = await saveCapsule({ created_by: user_id })
            let url = '/capsule/' + newCapsule.id
            url += loadDefault ? '?loadDefault=' + loadDefault : '' // Pass the loadDefault query parameter to the redirection

            return new Response(null, { status: 302, headers: { Location: url } })

        } catch (error) {
            return new Response("Error creating capsule", { status: 500 })
        }

    } else {        
        // The user is not logged in, we'll use a local storage capsule 
        const capsule_id = randomUUID()
        let url = '/capsule/' + capsule_id 
        url += '?local=true' // Tell the capsule page that this is a local capsule (so it won't try to fetch things)
        url += loadDefault ? '&loadDefault=' + loadDefault : '' // Pass the loadDefault query parameter to the redirection

        return new Response(null, { status: 302, headers: { Location: url } })
    }   
}
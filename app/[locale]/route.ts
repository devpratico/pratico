import { redirect } from "../_intl/intlNavigation"
import { fetchUser } from "./_actions/user"
import { saveCapsule } from "./_actions/capsule"

/**
 * The home page is the entry point for the app. There's no page actually,
 * it just redirects to the capsules page if the user is a full account, or to a new capsule if not.
 */
export async function GET() {
    const user = await fetchUser()

    if (!user.is_anonymous) {
        redirect('/capsules')

    } else {
        // Create an empty capsule and redirect to it
        const newCapsule = await saveCapsule({ created_by: user.id })
        redirect(`/capsule/${newCapsule.id}`)
    }
}
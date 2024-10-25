import { redirect } from "../_intl/intlNavigation"
import { fetchUser } from "@/app/(backend)/api/user/user.server"
import { saveCapsule } from "@/app/(backend)/api/capsule/capsule.server"

import logger from "../../_utils/logger"

/**
 * The home page is the entry point for the app. There's no page actually,
 * it just redirects to the capsules page if the user is a full account, or to a new capsule if not.
 */
export async function GET() {

    const { user, error } = await fetchUser()


    // If the user is registered, redirect to the dashboard (capsules) page
    if (user && !user.is_anonymous) {
        return redirect('/capsules')
    }

    // If the user is anonymous, open an empty capsule
    if (user && user.is_anonymous) {
        const { data, error } = await saveCapsule({ created_by: user.id, title: 'Sans titre' })
        if (error || !data) {
            logger.error('next:page', 'Home route error:', error)
            throw error
        } else {
            return redirect(`/capsule/${data.id}`)
        }
    }

    // If there's no user (or an error), redirect to empty capsule page
    if (!user || error) {
        return redirect('/capsule')
    }

    throw new Error('Unexpected error - user not found')
}
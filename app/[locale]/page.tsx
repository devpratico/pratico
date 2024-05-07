import { redirect } from "../_intl/intlNavigation"
import { getUser } from "./_actions/user"
import { saveCapsule } from "./_actions/capsule"

export default async function HomePage() {
    const user = await getUser()

    if (!user.is_anonymous) {
        redirect('/capsules')
    } else {
        // Create an empty capsule and redirect to it
        const newCapsule = await saveCapsule({ created_by: user.id})
        redirect(`/capsule/${newCapsule.id}`)
    }

    return null
}
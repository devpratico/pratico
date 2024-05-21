import { fetchUser } from "../_actions/user"
import { getTranslations } from "next-intl/server"


export default async function AdminPage() {
    const t = await getTranslations("admin")
    const user = await fetchUser()

    return (
        <div>
            <p>{t('hello')}</p>
            <p>{user.id}</p>
        </div>
    )
}
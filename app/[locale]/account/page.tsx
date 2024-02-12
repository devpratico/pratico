import styles from './page.module.css'
import { getTranslations } from 'next-intl/server';
import { getUser, signOut, getProfile } from '@/supabase/services/user';

export default async function AccountPage() {

    const t = await getTranslations("account")

    const { data, error } = await getUser()
    if (error || !data?.user) {
        //redirect('/')
        return <p>{error?.message ?? "error"}</p>
    }
    const user = data.user

    const { data: profileData, error: profileError } = await getProfile(user.id)
    //console.log("🤖", profileData)
    const {name, surname, stripe_id, nickname} = profileData?.[0] ?? {name: "no name", surname: "no surname", stripe_id: "no stripe_id", nickname: "no nickname"}


    return (
        <div className={styles.container}>
            <h1>{t('account')}</h1>
            <h4>{t("email") + ": " + user?.email}</h4>
            <p>{t("id") + ": " + user?.id}</p>
            <p>{t("name") + ": " + name}</p>
            <p>{t("surname") + ": " + surname}</p>
            <p>{t("stripe id") +": " + stripe_id}</p>
            <p>{t("nickname") + ": " + nickname}</p>
            {/*<button onClick={() => {signOut()}}>Logout</button>*/}
        </div>
    )
}
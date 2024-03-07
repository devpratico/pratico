import styles from './page.module.css'
import { getTranslations } from 'next-intl/server';
import { fetchUser } from '@/supabase/services/auth';
import { fetchProfile } from '@/supabase/services/user_profiles';
import { SignOutBtn, ResetPasswordBtn, SubscribeBtn, ManageSubscriptionBtn } from './buttons';
import { doesCustomerExist } from '@/stripe/services/customer';


export default async function AccountPage() {
    const t = await getTranslations("settings")

    const { data, error } = await fetchUser()
    if (error || !data?.user) {
        return <p>{error?.message ?? "error"}</p>
    }
    const user = data.user
    const { data: profileData, error: profileError } = await fetchProfile(user.id)
    const {name, surname, stripe_id, nickname} = profileData?.[0] ?? {name: "no name", surname: "no surname", stripe_id: "no stripe_id", nickname: "no nickname"}

    const customerExists = await doesCustomerExist(stripe_id)

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.title}>{t('information')}</h2>

                <p>{t("nickname") + ": " + nickname}</p>
                <p>{t("name") + ": " + name}</p>
                <p>{t("surname") + ": " + surname}</p>
                <p>{t("email") + ": " + user?.email}</p>
                <p>{t("id") + ": " + user?.id}</p>
                <div className={styles.buttons}>
                    <ResetPasswordBtn message={t("change password")}/>
                    <SignOutBtn message={t("sign out")}/>
                </div>

            </div>

            <div className={styles.card}>

            <h2 className={styles.title}>{t('subscription')}</h2>
            <p>{"Customer exists: " + customerExists}</p>
            <p>{t("stripe id") +": " + stripe_id}</p>
            <div className={styles.buttons}>
                <SubscribeBtn message={t("subscribe")}/>
                <ManageSubscriptionBtn message={t("manage subscription")}/>
            </div>
            </div>
            
        </div>
    )
}
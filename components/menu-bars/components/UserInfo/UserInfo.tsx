import styles from './UserInfo.module.css';
import Avatar from "@/components/primitives/Avatar/Avatar";;
import { fetchProfile } from '@/supabase/services/user_profiles';
import { fetchUser } from '@/supabase/services/auth';
import Link from 'next/link';
import LogInBtn from './LogInBtn';
import { getTranslations } from 'next-intl/server';


export default async function UserInfo() {

    const t = await getTranslations("auth")

    const {data, error} = await fetchUser()
    if (error || !data?.user) {
        return <LogInBtn>{t("sign in")}</LogInBtn>
    }
    const { data: profileData, error: profileError } = await fetchProfile(data?.user?.id)
    const name = profileData?.[0]?.name ?? "no name"
    const surname = profileData?.[0]?.surname ?? "no surname"
    const letters = name[0] + surname[0]

    return (
        <Link href='/settings' className={styles.container}>
            <p className={styles.text}>{name}</p>
            <Avatar size={35} alt={letters} />
        </Link>
    )
}
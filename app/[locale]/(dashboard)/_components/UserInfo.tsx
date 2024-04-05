import Avatar from "@/app/_components/primitives/Avatar/Avatar";;
import { fetchProfile } from '@/supabase/services/user_profiles';
import { fetchUser } from '@/supabase/services/auth';
import Link from 'next/link';
import LogInBtn from './LogInBtn';
import { getTranslations } from 'next-intl/server';


export const revalidate = 0

export default async function UserInfo() {

    const t = await getTranslations("auth")

    let user
    try {
        user = await fetchUser()
    } catch (error) {
        return <LogInBtn>{t("sign in")}</LogInBtn>
    }

    const { data: profileData, error: profileError } = await fetchProfile(user.id)
    const name = profileData?.[0]?.name ?? "no name"
    const surname = profileData?.[0]?.surname ?? "no surname"
    const letters = name[0] + surname[0]

    return (
        <Link href='/settings' style={containerStyle}>
            <p style={textStyle}>{name}</p>
            <Avatar size={35} alt={letters} />
        </Link>
    )
}


const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
}

const textStyle: React.CSSProperties = {
    fontSize: '0.9rem',
    lineHeight: 1,
    color: 'var(--secondary)',
}
import { Avatar } from '@radix-ui/themes';
import { fetchProfile } from '@/supabase/services/user_profiles';
import { fetchUser } from '@/supabase/services/auth';
import { Link } from "@/app/_intl/intlNavigation";
import LoginBtn from "../../_components/LoginBtn";
import { getTranslations } from 'next-intl/server';
import { CircleUser } from "lucide-react";


export const revalidate = 0

export default async function UserInfo() {

    const t = await getTranslations("dashboard")

    let user
    try {
        user = await fetchUser()
    } catch (error) {
        return <LoginBtn message={t('sign in')} />
    }

    if (!user || user.is_anonymous) {
        return <LoginBtn message={t('sign in')} />
    }

    const { data: profileData, error: profileError } = await fetchProfile(user.id)
    const name = profileData?.[0]?.name
    //const surname = profileData?.[0]?.surname
    //const letters = name[0] + surname[0]

    return (
        <Link href='/settings' style={containerStyle}>
            { name && <p style={textStyle}>{name}</p> }
            <Avatar
                size='3'
                variant='solid'
                radius='full'
                //style={{backgroundColor: 'red'}}
                fallback = {
                    <CircleUser size={30} strokeWidth={1.5} />
                }
            />
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
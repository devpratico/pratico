import { Avatar } from '@radix-ui/themes';
import { fetchUser, fetchNames } from '@/app/api/_actions/user';
import { Link } from "@/app/_intl/intlNavigation";
import { LoginBtn } from "../../../_components/LoginBtn";
import { getTranslations } from 'next-intl/server';
import { CircleUser } from "lucide-react";


export const revalidate = 0

export default async function UserInfo() {

    const t = await getTranslations("dashboard")

    let user
    try {
        user = await fetchUser()
        if (!user || user.is_anonymous) throw new Error("User not found")
    } catch (error) {
        return <LoginBtn />
    }


    const names = await fetchNames(user.id)

    return (
        <Link href='/settings' style={containerStyle}>
            { names && <p style={textStyle}>{names.first_name}</p> }
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
import { Avatar } from '@radix-ui/themes';
import { fetchUser, fetchNames } from '@/app/api/actions/user';
import { Link } from "@/app/_intl/intlNavigation";
import { LoginBtn, SignUpBtn } from "../../../_components/AuthBtns";
import { getTranslations } from 'next-intl/server';
import { CircleUser } from "lucide-react";


export const revalidate = 0

export default async function UserInfo() {
    //const t = await getTranslations("dashboard")

    const { user, error } = await fetchUser()

    if (!user) return <LoginBtn />
    if (user.is_anonymous) return <SignUpBtn />

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
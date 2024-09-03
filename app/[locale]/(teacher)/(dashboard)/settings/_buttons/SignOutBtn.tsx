'use client'
import { signOut } from '@/app/api/_actions/auth'
import { Button } from "@radix-ui/themes";
import { useRouter } from '@/app/_intl/intlNavigation';
import Link from 'next/link';


interface SignOutBtnProps {
    message: string
    disabled?: boolean
}

export function SignOutBtn({message, disabled}: SignOutBtnProps) {
    const router = useRouter()

    const handleSignOut = async () => {
        await signOut()
        router.push('https://pratico.live/')
        router.refresh()
    }

    return (
        <Button
                    color='red'
                    variant='soft'
                    onClick={handleSignOut}
                    disabled={disabled}
                >{message}</Button>
       
    )
}
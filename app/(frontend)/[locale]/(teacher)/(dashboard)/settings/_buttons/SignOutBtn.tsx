'use client'
import { signOut } from "@/app/(backend)/api/auth/auth.client";
import { Button } from "@radix-ui/themes";
import { useRouter } from '@/app/(frontend)/_intl/intlNavigation';

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
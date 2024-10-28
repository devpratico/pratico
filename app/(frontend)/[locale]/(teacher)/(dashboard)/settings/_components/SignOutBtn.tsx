'use client'
import { signOut } from "@/app/(backend)/api/auth/auth.client";
import { Button } from "@radix-ui/themes";
import { useRouter } from '@/app/(frontend)/_intl/intlNavigation';
import { useState } from "react";

interface SignOutBtnProps {
    message: string
    disabled?: boolean
}

export function SignOutBtn({message, disabled}: SignOutBtnProps) {
    const router = useRouter()
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleSignOut = async () => {
        setIsLoggingOut(true)
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
            loading={isLoggingOut}
        >{message}</Button>
    )
}
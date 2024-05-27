'use client'
import { signOut } from '@/app/[locale]/login/_actions/actions';
import { Button } from "@radix-ui/themes";
import { useRouter } from "next/navigation";


interface SignOutBtnProps {
    message: string
    disabled?: boolean
}

export function SignOutBtn({message, disabled}: SignOutBtnProps) {
    const router = useRouter()

    const handleSignOut = async () => {
        await signOut()
        router.push('/login')
        //router.refresh()
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
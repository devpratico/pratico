'use client'
import { signOut } from "@/supabase/services/auth";
import { Button } from "@radix-ui/themes";
import { useRouter } from "next/navigation";


export function SignOutBtn({message}: {message: string}) {
    const router = useRouter()

    const handleSignOut = async () => {
        await signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <Button color='red' variant='soft' onClick={handleSignOut}>{message}</Button>
    )
}
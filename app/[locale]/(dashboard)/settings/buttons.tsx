'use client'
import { signOut } from "@/supabase/services/user";
import PlainBtn from "@/components/primitives/buttons/PlainBtn/PlainBtn";
import { useRouter } from "next/navigation";


export function SignOutBtn({message}: {message: string}) {
    const handleSignOut = async () => {
        await signOut()
    }

    return (
        <PlainBtn
            color={"red"}
            style={"soft"}
            size={"m"}
            onClick={handleSignOut}>
                {message}
        </PlainBtn>
    )
}



export function ResetPasswordBtn({message}: {message: string}) {
    return (
        <PlainBtn
            color={"secondary"}
            onClick={() => console.log("reset password")}>
                {message}
        </PlainBtn>
    )
}


export function SubscribeBtn({message}: {message: string}) {
    const router = useRouter()
    const handleSubscribe = () => {
        router.push("/subscribe")
    }

    return (
        <PlainBtn
            onClick={handleSubscribe}>
                {message}
        </PlainBtn>
    )
}
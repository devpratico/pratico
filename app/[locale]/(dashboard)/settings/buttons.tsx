'use client'
import { signOut } from "@/supabase/services/auth";
import PlainBtn from "@/components/primitives/buttons/PlainBtn/PlainBtn";
import { useRouter } from "next/navigation";
import config from "@/stripe/stripe.config";


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
            enabled={false}
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


export function ManageSubscriptionBtn({message}: {message: string}) {
    const router = useRouter()
    // Depending on the environment, the url will be different
    const url = config.customerPortalUrl[process.env.NODE_ENV]

    const handleManageSubscription = () => {
        router.push(url)
    }

    return (
        <PlainBtn
            color={"secondary"}
            onClick={handleManageSubscription}>
                {message}
        </PlainBtn>
    )
}
'use client'
import { signOut } from "@/supabase/services/auth";
import PlainBtn from "@/components/primitives/buttons/PlainBtn/PlainBtn";
import { useRouter } from "next/navigation";
import config from "@/stripe/stripe.config";


export function SignOutBtn({message}: {message: string}) {
    const router = useRouter()

    const handleSignOut = async () => {
        await signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <PlainBtn
            color={"red"}
            style={"soft"}
            size={"m"}
            onClick={handleSignOut}
            message={message}
        />
    )
}



export function ResetPasswordBtn({message}: {message: string}) {
    return (
        <PlainBtn
            enabled={false}
            color={"secondary"}
            onClick={() => console.log("reset password")}
            message={message}
        />
    )
}


export function SubscribeBtn({message}: {message: string}) {
    const router = useRouter()
    const handleSubscribe = () => {
        router.push("/subscribe")
    }

    return (
        <PlainBtn
            onClick={handleSubscribe}
            message={message}
        />
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
            onClick={handleManageSubscription}
            message={message}
        />
    )
}
'use client'
import { useRouter } from "next/navigation";
import config from "@/app/_stripe/stripe.config";
import { Button } from "@radix-ui/themes";


export function ManageSubscriptionBtn({message}: {message: string}) {
    const router = useRouter()
    // Depending on the environment, the url will be different
    const url = config.customerPortalUrl[process.env.NODE_ENV]

    const handleManageSubscription = () => {
        router.push(url)
    }

    return (
        /*
        <PlainBtn
            color={"secondary"}
            onClick={handleManageSubscription}
            message={message}
        />*/
        <Button onClick={handleManageSubscription}>{message}</Button>
    )
}
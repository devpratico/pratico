'use client'
import { useRouter } from "next/navigation";
import config from "@/app/api/stripe/stripe.config";
import { Button, ButtonProps } from "@radix-ui/themes";


interface ManageSubscriptionBtnProps extends ButtonProps {
    message: string
}

export function ManageSubscriptionBtn({message, ...props}: ManageSubscriptionBtnProps) {
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
        <Button onClick={handleManageSubscription} {...props}>{message}</Button>
    )
}
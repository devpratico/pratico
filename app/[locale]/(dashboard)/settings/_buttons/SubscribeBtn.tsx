'use client'
import { Button, ButtonProps } from "@radix-ui/themes";
import { useRouter } from "next/navigation";


interface SubscribeBtnProps extends ButtonProps {
    message: string
}

export function SubscribeBtn({message, ...props}: SubscribeBtnProps) {
    const router = useRouter()
    const handleSubscribe = () => {
        router.push("/subscribe")
    }

    return (
        <Button onClick={handleSubscribe} {...props}>{message}</Button>
    )
}
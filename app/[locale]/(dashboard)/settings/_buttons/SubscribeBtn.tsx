'use client'
import { Button } from "@radix-ui/themes";
import { useRouter } from "next/navigation";


export function SubscribeBtn({message}: {message: string}) {
    const router = useRouter()
    const handleSubscribe = () => {
        router.push("/subscribe")
    }

    return (
        <Button onClick={handleSubscribe}>{message}</Button>
    )
}
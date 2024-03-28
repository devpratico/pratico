'use client'
import PlainBtn from "@/components/primitives/buttons/PlainBtn/PlainBtn";
import { useRouter } from "next/navigation";

export default function LogInBtn({children}: {children: React.ReactNode}) {

    const router = useRouter()
    const handleClick = () => {
        router.push('/login')
        router.refresh()
    }

    return (
        <PlainBtn
            color={"secondary"}
            style={"solid"}
            onClick={handleClick}
            message={children as string}
        />
    )
}
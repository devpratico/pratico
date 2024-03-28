'use client'
import PlainBtn from "@/components/primitives/buttons/PlainBtn/PlainBtn";
import { useRouter } from "next/navigation";


export function CreateCapsuleBtn() {

    const router = useRouter()

    const handleClick = () => {
        router.push('/capsule/create')
    }
    return (
        <PlainBtn
            onClick={handleClick}
            message="Create"
        >
        </PlainBtn>
    )
}
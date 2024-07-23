'use client'
import { fetchUser } from "@/app/api/_actions/user";
import { saveCapsule } from "@/app/api/_actions/capsule";
import { Button } from "@radix-ui/themes";
import { useRouter } from "@/app/_intl/intlNavigation";
import { Plus } from "lucide-react";
import { useState } from "react";


interface CreateCapsuleBtnProps {
    message: string
}

export default function CreateCapsuleBtn({ message }: CreateCapsuleBtnProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    
    async function handleClick() {
        setLoading(true)
        try {
            const userId = (await fetchUser()).id;
            const newCapsule = await saveCapsule({ created_by: userId })
            router.push('/capsule/' + newCapsule.id)
        } catch (error) {
            setLoading(false)
            console.error("Error creating capsule", error)
        }
    }

    return (
        <Button onClick={handleClick} loading={loading}>
            <Plus />
            {message}
        </Button>
    )
        
}
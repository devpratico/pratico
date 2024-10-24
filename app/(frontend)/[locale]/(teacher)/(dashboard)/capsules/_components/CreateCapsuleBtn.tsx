'use client'
import { fetchUser } from "@/app/(backend)/api/user/user.client";
import { saveCapsule } from "@/app/(backend)/api/capsule/capsule.client";
import { Button } from "@radix-ui/themes";
import { useRouter } from "@/app/(frontend)/_intl/intlNavigation";
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

        const { user, error } = await fetchUser()
        if (error || !user) {
            setLoading(false)
            return
        }

        const { data, error: saveError } = await saveCapsule({ created_by: user.id, title: 'Sans titre' })

        if (saveError || !data) {
            setLoading(false)
            return
        }

        router.push('/capsule/' + data.id)
    }

    return (
        <Button onClick={handleClick} loading={loading}>
            <Plus />
            {message}
        </Button>
    )
        
}
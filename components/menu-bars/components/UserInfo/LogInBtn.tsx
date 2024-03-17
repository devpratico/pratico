'use client'
import PlainBtn from "@/components/primitives/buttons/PlainBtn/PlainBtn";
import { useUi } from "@/hooks/useUi";
import { useRouter } from "next/navigation";

export default function LogInBtn({children}: {children: React.ReactNode}) {

    //const { setAuthDialogOpen } = useUi()
    const router = useRouter()

    return (
        <PlainBtn
            color={"secondary"}
            style={"solid"}
            //onClick={() => setAuthDialogOpen(true)}
            onClick={() => router.push('/login')}
            message={children as string}
        />
    )
}
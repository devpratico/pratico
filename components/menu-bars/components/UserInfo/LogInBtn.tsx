'use client'
import PlainBtn from "@/components/primitives/buttons/PlainBtn/PlainBtn";
import { useUi } from "@/hooks/useUi";

export default function LogInBtn({children}: {children: React.ReactNode}) {

    const { setAuthDialogOpen } = useUi()

    return (
        <PlainBtn
            color={"secondary"}
            style={"solid"}
            onClick={() => setAuthDialogOpen(true)}
            message={children as string}
        />
    )
}
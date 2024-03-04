'use client'
import PlainBtn from "@/components/primitives/buttons/PlainBtn/PlainBtn";
import { useUi } from "@/hooks_i/uiContext";

export default function LogInBtn({children}: {children: React.ReactNode}) {

    const { setAuthDialogOpen } = useUi()

    return (
        <PlainBtn
            color={"secondary"}
            style={"solid"}
            onClick={() => setAuthDialogOpen(true)}>
                {children}
        </PlainBtn>
    )
}
'use client'
import { signOut } from "@/supabase/services/user";
import PlainBtn from "@/components/primitives/buttons/PlainBtn/PlainBtn";


interface SignOutBtnProps {
    message: string;
}

export default function SignOutBtn({message}: SignOutBtnProps) {
    const handleSignOut = async () => {
        await signOut()
    }

    return (
        <PlainBtn
            color={"red"}
            style={"outline"}
            onClick={handleSignOut}>
                {message}
        </PlainBtn>
    )
}
'use client'
import { Button } from "@radix-ui/themes";


export function ResetPasswordBtn({message}: {message: string}) {
    return (
        <Button disabled={true}  >{message}</Button>
    )
}
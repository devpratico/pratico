'use client'
import { Button } from "@radix-ui/themes"
import { sendDiscordError } from "@/app/(backend)/api/discord/wrappers"


export default function Page() {
    function onCLick() {
        sendDiscordError('Hello again')
    }
    return (
        <div>
            <h1>Playground</h1>
            <Button onClick={onCLick}>Send Discord Error</Button>
        </div>
    )
}
'use client'
import Link from "next/link";
import { Send } from "lucide-react";
import { Button } from "@radix-ui/themes";
import { useDisable } from "@/app/[locale]/_hooks/useDisable";

export default function FeedbackBtn() {

    const { disabled } = useDisable()

    return (
        <Link href='mailto:bonjour@pratico.live' style={{all:'unset', color:'var(--background)'}}>
            <Button style={{backgroundColor:'var(--pink)'}} disabled={disabled}>
                <Send />
                votre avis
            </Button>
        </Link>
    )
}
import Link from "next/link";
import { Send } from "lucide-react";
import { Button } from "@radix-ui/themes";

export default function FeedbackBtn() {
    return (
        <Link href='mailto:bonjour@pratico.live' style={{all:'unset', color:'var(--background)'}}>
            <Button style={{backgroundColor:'var(--pink)'}}>
                <Send />
                votre avis
            </Button>
        </Link>
    )
}
import Link from "next/link";
import { Send } from "lucide-react";
import { Flex, Text } from "@radix-ui/themes";

export default function FeedbackBtn() {
    return (
        <Link href='mailto:bonjour@pratico.live' style={{all:'unset', color:'var(--background)'}}>
            <Flex direction='column' align='center' gap='1'>
                <Send />
                <Text as='label' size='1'>feedback</Text>
            </Flex>
        </Link>
    )
}
'use client'
import { Button, Popover, Callout } from "@radix-ui/themes"
import  *  as PrimitivePopover from "@radix-ui/react-popover"
import { useRouter } from "@/app/_intl/intlNavigation"
import { Lightbulb } from "lucide-react"
import { useHints } from "../_hooks/useHints"


interface LoginBtnProps {
    message: string;
    nextUrl?: string;
}

export default function LoginBtn({ message, nextUrl }: LoginBtnProps) {
    const router = useRouter()
    const { currentHint, setCurrentHint } = useHints()

    return (
        <Popover.Root
            open={currentHint=='login'}
            onOpenChange={open => setCurrentHint(open ? 'login' : undefined)}
        >
            <PrimitivePopover.Anchor>
                <Button
                    variant='solid'
                    radius='large'
                    color='yellow'
                    //style={{ backgroundColor: 'var(--background)' }}
                    onClick={() => router.push('/login' + (nextUrl ? '?nextUrl=' + nextUrl : ''))}
                >
                    {message}
                </Button>
            </PrimitivePopover.Anchor>

            <Popover.Content maxWidth='300px' style={{padding:'0'}}>
                <Callout.Root color='yellow'>
                    <Callout.Icon>
                        <Lightbulb />
                    </Callout.Icon>
                    <Callout.Text>
                        Pour sauvegarder votre travail, connectez-vous ou créez un compte
                    </Callout.Text>
                </Callout.Root>
            </Popover.Content>
        </Popover.Root>
        
    )
}
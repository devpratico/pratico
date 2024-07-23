'use client'
import { Button } from "@radix-ui/themes"
import { useRouter } from "@/app/_intl/intlNavigation"
import { useDisable } from "@/app/_hooks/useDisable"


interface LoginBtnProps {
    message: string;
    nextUrl?: string;
}

export default function LoginBtn({ message, nextUrl }: LoginBtnProps) {
    const router = useRouter()
    const { disabled } = useDisable()

    return (
        <Button
            variant='solid'
            radius='large'
            color='yellow'
            style={{ backgroundColor: 'var(--yellow)' }}
            disabled={disabled}
            onClick={() => router.push('/login' + (nextUrl ? '?nextUrl=' + nextUrl : ''))}
        >
            {message}
        </Button>
    )
}
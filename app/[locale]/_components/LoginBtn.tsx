'use client'
import { Button } from "@radix-ui/themes"
import { useRouter } from "@/app/_intl/intlNavigation"


interface LoginBtnProps {
    message: string;
    nextUrl?: string;
}

export default function LoginBtn({ message, nextUrl }: LoginBtnProps) {
    const router = useRouter()
    return (
        <Button
            variant='surface'
            radius='large'
            style={{ backgroundColor: 'var(--background)' }}
            onClick={() => router.push('/login' + (nextUrl ? '?nextUrl=' + nextUrl : ''))}
        >
            {message}
        </Button>
    )
}
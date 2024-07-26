import { Button, Spinner, BoxProps, Box } from "@radix-ui/themes"
import { Link } from "@/app/_intl/intlNavigation"
import { isUserAnonymous } from "../login/_actions/actions"
import { Suspense } from "react"


type LoginBtnProps = BoxProps & {
    nextUrl?: string;
}


export function LoginBtn({ nextUrl, ...props }: LoginBtnProps) {
    return (
        <Box {...props}>
            <Button color='yellow' style={{ backgroundColor: 'var(--yellow)' }} asChild>
                <Link href={'/login' + (nextUrl ? '?nextUrl=' + nextUrl : '')}>
                    se connecter
                </Link>
            </Button>
        </Box>
    )
}


async function LoginBtnIfAnonymousS({ nextUrl, ...props }: LoginBtnProps) {
    const isAnonymous = await isUserAnonymous()
    return isAnonymous ? <LoginBtn nextUrl={nextUrl} {...props} /> : null
}


export default function LoginBtnIfAnonymous({ nextUrl, ...props }: LoginBtnProps) {
    return (
        <Suspense fallback={<Spinner />}>
            <LoginBtnIfAnonymousS nextUrl={nextUrl} {...props} />
        </Suspense>
    )
}
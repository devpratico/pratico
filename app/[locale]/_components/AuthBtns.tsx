import { Button } from "@radix-ui/themes"
import { Link } from "@/app/_intl/intlNavigation"
import { Link as RadixLink } from "@radix-ui/themes";

type LoginBtnProps = {
    nextUrl?: string;
}

/**
 * This button should not be seen by authenticated users
 * so it should not be seen by anyone as we ask users to sign in or sign up,
 * with an anonymous sign in possibility
 */
export function LoginBtn({ nextUrl }: LoginBtnProps) {
    return (
        <Button color='orange' asChild>
            <Link href={'/auth?authTab=login' + (nextUrl ? '?nextUrl=' + nextUrl : '')}>
				{/* <RadixLink> */}
             	   se connecter					
				{/* </RadixLink> */}
            </Link>
        </Button>
    )
}


export function SignUpBtn({ nextUrl }: LoginBtnProps) {
    return (
        <Button color='yellow' asChild>
            <Link href={'/auth?authTab=signup' + (nextUrl ? '?nextUrl=' + nextUrl : '')}>
				{/* <RadixLink> */}
	                Créer un compte				
				{/* </RadixLink> */}
            </Link>
        </Button>
    )
}
'use client'
import { AlertDialog, Button, Flex } from "@radix-ui/themes"
import { useEffect, useState } from "react"
import { Link } from "@/app/_intl/intlNavigation"
import { fetchUser } from "@/app/api/_actions/user"
import { usePathname } from "@/app/_intl/intlNavigation"
import { signInAnonymously } from "@/app/api/_actions/auth"


export default function WelcomeDialog() {
    const [show, setShow] = useState(false)
    const pathname = usePathname()

    // Show the dialog if the user is not authenticated
    useEffect(() => {
        fetchUser().then(({user, error}) => { if (!user) setShow(true) })
    }, [])

    async function handleLater() {
        setShow(false)
        const { data, error } = await signInAnonymously()
    }

    return (
        <AlertDialog.Root open={show} onOpenChange={setShow}>
            <AlertDialog.Content>

                <AlertDialog.Title>
                    Bienvenue sur Pratico !
                </AlertDialog.Title>

                <AlertDialog.Description>
                    Pour profiter des fonctionnalités de Pratico, connectez-vous ou créez un compte.
                </AlertDialog.Description>

                <Flex gap='2' justify='between' align='baseline' mt='7'>
                    <AlertDialog.Cancel>
                        <Button variant='ghost' onClick={handleLater}>
                            Plus tard
                        </Button>
                    </AlertDialog.Cancel>

                    <Flex gap='2'>
                        <AlertDialog.Action>
                            <Button asChild variant='soft'>
                                <Link href={`/auth?authTab=login&nextUrl=${pathname}`}>
                                    Se connecter
                                </Link>
                            </Button>
                        </AlertDialog.Action>

                        <AlertDialog.Action>
                            <Button asChild>
                                <Link href={`/auth?authTab=signup&nextUrl=${pathname}`}>
                                    Créer un compte
                                </Link>
                            </Button>
                        </AlertDialog.Action>
                    </Flex>
                </Flex>

                

            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}
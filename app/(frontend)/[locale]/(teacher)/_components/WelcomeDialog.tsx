'use client'
import { AlertDialog, Button, Flex } from "@radix-ui/themes"
import { useState } from "react"
import { Link } from "@/app/(frontend)/_intl/intlNavigation"
import { signInAnonymously } from "@/app/(backend)/api/actions/auth"
import { saveCapsule } from "@/app/(backend)/api/actions/capsule"
import { useRouter } from "@/app/(frontend)/_intl/intlNavigation"
import { useAuth } from "@/app/(frontend)/_hooks/useAuth"


export default function WelcomeDialog() {
    const { user } = useAuth()
    const [show, setShow] = useState(!user)
    const router = useRouter()

    const routes = {
        login:  `/auth?authTab=login&nextUrl=${encodeURIComponent('/capsules')}`,
        signup: `/auth?authTab=signup&nextUrl=${encodeURIComponent('/capsules')}`,
        later:  (capsuleId: string) => `/capsule/${capsuleId}`
    }

    async function handleLater() {

        const { data: userData, error: userError } = await signInAnonymously()
        if (userError || !userData.user) throw userError || new Error('No user data')

        // Create a new capsule and redirect to it
        const { data: capsuleData, error: capsuleError } = await saveCapsule({ created_by: userData.user.id, title: 'Sans titre' })
        if (capsuleError || !capsuleData) throw capsuleError || new Error('No capsule data')
        
        router.push(routes.later(capsuleData.id))
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
                                <Link href={routes.login}>
                                    Se connecter
                                </Link>
                            </Button>
                        </AlertDialog.Action>

                        <AlertDialog.Action>
                            <Button asChild>
                                <Link href={routes.signup}>
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
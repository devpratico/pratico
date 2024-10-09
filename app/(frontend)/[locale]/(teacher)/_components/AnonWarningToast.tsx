'use client'
import * as Toast from '@radix-ui/react-toast';
import { Card, Button, Flex, Text } from '@radix-ui/themes';
import { useState, useEffect } from 'react';
import { Link, usePathname } from '@/app/(frontend)/_intl/intlNavigation';
import { fetchUser } from "@/app/(backend)/api/actions/user"


export default function AnonWarningToast() {
    const [show, setShow] = useState(false)
    const pathname = usePathname()

    // Show if the user is anonymous
    useEffect(() => {
        fetchUser().then(({ user, error }) => {
            if (user?.is_anonymous) {
                // Show the toast after 5 seconds
                setTimeout(() => setShow(true), 5000)
            }
        })
    }, [])

    return (
        <Toast.Provider duration={10000}>

            <Toast.Root open={show} onOpenChange={setShow} asChild>
                <Card variant='classic' style={{boxShadow:'var(--shadow-5)'}}>

                    <Toast.Title>
                        <Text size='2' weight='bold'>{`⚠️ Vous n'êtes pas connecté`}</Text>
                    </Toast.Title>



                    <Toast.Description>
                        <Text size='1' color='gray'>
                            Créez un compte pour sauvegarder votre travail et accéder à toutes les fonctionnalités de Pratico.
                        </Text>
                    </Toast.Description>






                    <Flex gap='3' align='baseline' width='100%' justify='end' mt='2'>
                        <Toast.Close asChild>
                            <Button variant='ghost' color='gray' size='1'>Ignorer</Button>
                        </Toast.Close>

                        <Toast.Action asChild altText='Créer un compte'>
                            <Button asChild variant='soft' color='green' size='1'>
                                <Link href={`/auth?authTab=login&nextUrl=${pathname}`}>
                                    Créer un compte
                                </Link>
                            </Button>
                        </Toast.Action>
                    </Flex>

                </Card>
            </Toast.Root>

            <Toast.Viewport style={{position:'fixed', top:'0', right:'0', padding:'var(--space-2)', zIndex:'2'}}/>
        </Toast.Provider>
    )
}
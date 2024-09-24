'use client' // Error components must be Client Components
import { useEffect } from 'react'
import logger from '../_utils/logger'
import { Container, Section, Callout, Button, Card, Heading, Flex } from '@radix-ui/themes'
import { TriangleAlert, RefreshCcw, House } from 'lucide-react'
import { Link } from '../_intl/intlNavigation'

export default function Error({ error, reset}: { error: Error & { digest?: string }, reset: () => void }) {

    useEffect(() => {
        logger.error('next:page', 'Error causing a fallback to the error page:', error.message, error.stack)
    }, [error])

        return (
            <Container size='2' p='2' height='100dvh'  style={{backgroundColor:'var(--accent-2)'}}>
                <Section>

                    <Card size='5'>

                        <Flex direction='column' align='center' gap='7'>

                        <Heading as='h1' align='center'>Oups ! Une erreur est survenue...</Heading>

                        <Callout.Root color='red'>
                            <Callout.Icon>
                                <TriangleAlert />
                            </Callout.Icon>
                            <Callout.Text>
                                {error.message}
                            </Callout.Text>
                        </Callout.Root>

                        <Flex gap='2'>
							<Button variant='soft' onClick={() => reset()}>
										<RefreshCcw />
										Réessayer
									</Button>
                            <Button asChild>
                                <Link href='/capsules'>
                                    <House />
                                    {`Retour à l'accueil`}
                                </Link>
                            </Button>

                        </Flex>

                        </Flex>

                    </Card>


                </Section>
            </Container>
        )
}
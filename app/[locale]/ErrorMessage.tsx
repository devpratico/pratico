'use client';

import { Container, Section, Callout, Button, Card, Heading, Flex } from '@radix-ui/themes'
import { TriangleAlert, House } from 'lucide-react'
import { Link } from '@/app/_intl/intlNavigation'

export default function ErrorMessage({ message }: { message?: string }) {
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
									{message ? message : null}
								</Callout.Text>
							</Callout.Root>

							<Flex gap='2'>
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

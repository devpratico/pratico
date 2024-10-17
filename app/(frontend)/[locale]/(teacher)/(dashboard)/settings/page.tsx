import { getProfile, getUser } from '@/app/(backend)/data-access/user';
import { Container, Section, Heading, Card, ScrollArea, Callout } from '@radix-ui/themes';
import InfosSettings from './_components/InfosSettings';
import AccountSettings from './_components/AccountSettings';
import { Info } from 'lucide-react';




export default async function AccountPage() {
    const { data: {user: user} } = await getUser()
    const { data: profileData } = user ? await getProfile(user.id) : {data: null}

	return (
        <ScrollArea>
            <Container pr='3' px={{ initial: '3', xs: '0' }}>

                <Section>
                    <Heading as='h1' mb='2'>Informations</Heading>

                    <Card size='4'>

                        <Callout.Root color='gray' variant='outline' mb='5'>
                            <Callout.Icon><Info size={15}/></Callout.Icon>
                            <Callout.Text>
                                Les informations que vous renseignez ici seront visibles sur vos rapports de sessions.
                            </Callout.Text>
                        </Callout.Root>

					    <InfosSettings teacher={user} profileData={profileData}/>

                    </Card>

				</Section>
                

                <Section>
                    <Heading as='h1' mb='2'>Mon compte</Heading>
                    <Card size='4'>
                        <AccountSettings />
                    </Card>
                </Section>

            </Container>
        </ScrollArea>
    )
}
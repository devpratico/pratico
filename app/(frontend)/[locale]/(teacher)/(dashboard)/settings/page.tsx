import { getProfile, getUser } from '@/app/(backend)/data-access/user';
import { SignOutBtn } from './_components/SignOutBtn';
import { Container, Section, Heading, Flex, Card, ScrollArea, Callout, Button, Separator } from '@radix-ui/themes';
import InfosSettings from './_components/InfosSettings';
import { TriangleAlert, Info } from 'lucide-react';
import Link from '../../../_components/Link';
import StripeSettings from './_components/StripeSettings';



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

                        <StripeSettings />

                        <Separator size='4' my='6' />

                        { user?.is_anonymous &&
                            <Callout.Root color='gray' variant='outline' my='5'>
                                <Callout.Icon><TriangleAlert size={15} /></Callout.Icon>
                                <Callout.Text>
                                    <span>Vous êtes actuellement connecté avec une session anonyme.
                                    Vos données ne sont pas sauvegardées. Pour profiter pleinement de Pratico,&nbsp;
                                    <Link href='/auth?authTab=login'>connectez-vous</Link>
                                    &nbsp;ou&nbsp;
                                    <Link href='/auth?authTab=signup'>créez un compte</Link>.
                                    </span>
                                </Callout.Text>
                            </Callout.Root>
                        }

                        <Flex gap='4' wrap='wrap'>
                            <Button disabled>Changer son mot de passe</Button>
                            <SignOutBtn message={"Se déconnecter"} />
                        </Flex>

                        

                        
                    </Card>


                </Section>



            </Container>
        </ScrollArea>
    )
}
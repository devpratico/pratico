import { getTranslations } from 'next-intl/server';
import { fetchProfile, fetchUser } from '@/app/(backend)/api/actions/user'
import { Container, Section, Heading, DataList, Separator, Flex, Badge, Code, Card, ScrollArea } from '@radix-ui/themes';
import { ResetPasswordBtn } from '../(teacher)/(dashboard)/settings/_buttons/ResetPasswordBtn';
import { ManageSubscriptionBtn } from '../(teacher)/(dashboard)/settings/_buttons/ManageSubscriptionBtn';
import { SignOutBtn } from '../(teacher)/(dashboard)/settings/_buttons/SignOutBtn';
import { SubscribeBtn } from '../(teacher)/(dashboard)/settings/_buttons/SubscribeBtn';

export default async function PlayGround () {
	if (process.env.NODE_ENV === 'production') {
		return (null);
	}
	const user = {
		first_name: "Earl",
		last_name: "Hickey",
		email: "ehickey@student.42.fr",
		organization: {
			name: "The Doctor",
			adress: "123 diitkejjh, Gallifrey"
		}
	}
    return (
        <ScrollArea>
            <Container pr='3' px={{ initial: '3', xs: '0' }}>

                <Section>

                        <Heading as='h1' mb='2'>{'information'}</Heading>
                        <Card size='4'>
                            <DataList.Root>
                                <DataList.Item>
                                    <DataList.Label>{'name'}</DataList.Label>
                                    <DataList.Value>{user.first_name || <Badge color='gray'>aucun</Badge>}</DataList.Value>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.Label>{'surname'}</DataList.Label>
                                    <DataList.Value>{user.last_name || <Badge color='gray'>aucun</Badge>}</DataList.Value>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.Label>{"email"}</DataList.Label>
                                    <DataList.Value>{user.email || <Badge color='gray'>aucun</Badge>}</DataList.Value>
                                </DataList.Item>
								<DataList.Item>
                                    <DataList.Label>{"organization"}</DataList.Label>
									<Flex>
										<DataList.Label style={{marginLeft: '10px'}}>{"name"}</DataList.Label>
										<DataList.Value>{user.organization.name || <Badge color='gray'>aucun</Badge>}</DataList.Value>
										<DataList.Label style={{marginLeft: '10px'}}>{"adress"}</DataList.Label>
										<DataList.Value>{user.organization.adress || <Badge color='gray'>aucun</Badge>}</DataList.Value>

									</Flex>
									
                                </DataList.Item>
                            </DataList.Root>

                            <Separator size='4' my='4'/>

                            <Flex gap='4' wrap='wrap'>
                                <ResetPasswordBtn message={"change password"}/>
                                <SignOutBtn message={"sign out"}/>
                            </Flex>
                        </Card>

                </Section>

                <Section>
                    <Heading as='h1' mb='2'>{'subscription'}</Heading>
                    <Card size='4'>

                        <Flex gap='4'>
                            <SubscribeBtn message={"subscribe"} disabled={true}/>
                            <ManageSubscriptionBtn message={"manage subscription"} disabled={true}/>
                        </Flex>
                    </Card>
                </Section>

            </Container>
        </ScrollArea>
    )
}
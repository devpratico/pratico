import { getTranslations } from 'next-intl/server';
import { fetchProfile, fetchUser } from '@/app/(backend)/api/actions/user'
import { Container, Section, Heading, DataList, Separator, Flex, Badge, Code, Card, ScrollArea, Button } from '@radix-ui/themes';
import { ResetPasswordBtn } from '../(teacher)/(dashboard)/settings/_buttons/ResetPasswordBtn';
import { ManageSubscriptionBtn } from '../(teacher)/(dashboard)/settings/_buttons/ManageSubscriptionBtn';
import { SignOutBtn } from '../(teacher)/(dashboard)/settings/_buttons/SignOutBtn';
import { SubscribeBtn } from '../(teacher)/(dashboard)/settings/_buttons/SubscribeBtn';
import { Dot } from 'lucide-react';
import AddOrganizationBtn from '../(teacher)/(dashboard)/settings/_buttons/AddOrganizationBtn';

export default async function PlayGround () {
	if (process.env.NODE_ENV === 'production') {
		return (null);
	}
	const t = await getTranslations("settings");

	const profileData = {
		id: "blabla",
		first_name: "Earl",
		last_name: "Hickey",
		email: "ehickey@student.42.fr",
		organization: {
			active: false,
			name: "The Doctor",
			adress: "123 diitkejjh, Gallifrey"
		}
	}
	return (
        <ScrollArea>
            <Container pr='3' px={{ initial: '3', xs: '0' }}>

                <Section>

                        <Heading as='h1' mb='2'>{t('information')}</Heading>

                        <Card size='4'>
                            <DataList.Root>
								<Heading size='5'>Personnelles</Heading>
                                {/*
                                <DataList.Item>
                                    <DataList.Label>{t("nickname")}</DataList.Label>
                                    <DataList.Value>{nickname}</DataList.Value>
                                </DataList.Item>*/}
                                <DataList.Item>
                                    <DataList.Label>{t("name")}</DataList.Label>
                                    <DataList.Value>{profileData?.first_name || <Badge color='gray'>aucun</Badge>}</DataList.Value>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.Label>{t("surname")}</DataList.Label>
                                    <DataList.Value>{profileData?.last_name || <Badge color='gray'>aucun</Badge>}</DataList.Value>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.Label>{t("email")}</DataList.Label>
                                    <DataList.Value>{profileData?.email || <Badge color='gray'>aucun</Badge>}</DataList.Value>
                                </DataList.Item>
                                {/*<DataList.Item>
                                    <DataList.Label>{t("id")}</DataList.Label>
                                    <DataList.Value><Code>{user?.id}</Code></DataList.Value>
                                </DataList.Item>*/}
								<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
								<Heading size='5'>Organisation</Heading>
								{

									(profileData.organization.active)
									? <>
										<DataList.Item>
											<DataList.Label>{t("surname")}</DataList.Label>
											<DataList.Value>{profileData?.organization?.name || <Badge color='gray'>aucun</Badge>}</DataList.Value>
										</DataList.Item>
										<DataList.Item>
											<DataList.Label>{t("address")}</DataList.Label>
											<DataList.Value>{profileData?.organization?.adress || <Badge color='gray'>aucun</Badge>}</DataList.Value>
										</DataList.Item>
									</>
									: <AddOrganizationBtn userId={profileData.id} />
								}
								</div>
                            </DataList.Root>

                            <Separator size='4' my='4'/>

                            <Flex gap='4' wrap='wrap'>
                                <ResetPasswordBtn message={t("change password")}/>
                                <SignOutBtn message={t("sign out")}/>
                            </Flex>
                        </Card>

                </Section>

                <Section>
                    <Heading as='h1' mb='2'>{t('subscription')}</Heading>
                    <Card size='4'>

                        {/*<DataList.Root>
                            <DataList.Item>
                                <DataList.Label>{t("customer exists")}</DataList.Label>
                                <DataList.Value>{customerExists ? <Badge color='green' radius='full'>yes</Badge> : <Badge color='red' radius='full'>no</Badge>}</DataList.Value>
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.Label>{t("stripe id")}</DataList.Label>
                                <DataList.Value><Code>{stripe_id}</Code></DataList.Value>
                            </DataList.Item>
                        </DataList.Root>

                        <Separator size='4' my='4'/>*/}

                        <Flex gap='4'>
                            <SubscribeBtn message={t("subscribe")} disabled={true}/>
                            <ManageSubscriptionBtn message={t("manage subscription")} disabled={true}/>
                        </Flex>
                    </Card>
                </Section>

                
                {/*<Section size='1'>
                    <Heading as='h1' mb='2'>{'Software'}</Heading>
                    <Card size='4'>

                        <DataList.Root>
                            <DataList.Item>
                                <DataList.Label>{"Supabase URL"}</DataList.Label>
                                <DataList.Value>{process.env.NEXT_PUBLIC_SUPABASE_URL}</DataList.Value>
                            </DataList.Item>
                        </DataList.Root>

                    </Card>
                </Section>*/}

            </Container>
        </ScrollArea>
    )
}
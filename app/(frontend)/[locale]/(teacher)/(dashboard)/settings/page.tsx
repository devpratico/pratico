import { getTranslations } from 'next-intl/server';
import { fetchUser } from '@/app/(backend)/api/user/user.server';
import { fetchProfile, fetchStripeId } from './actions';
import { SubscribeBtn } from './_buttons/SubscribeBtn';
import { ManageSubscriptionBtn } from './_buttons/ManageSubscriptionBtn';
import { Container, Section, Heading, DataList, Separator, Flex, Badge, Code, Card, ScrollArea, TextField } from '@radix-ui/themes';
import InfosSettings from './_components/InfosSettings';



export default async function AccountPage() {
    const t = await getTranslations("settings")

    const { user, error } = await fetchUser()
    let profileData: any = undefined

    if (user) {
        profileData = (await fetchProfile(user.id)).data
    }
    


    //const {name, surname, stripe_id, nickname} = profileData?.[0] ?? {name: "no name", surname: "no surname", stripe_id: "no stripe_id", nickname: "no nickname"}
    //const customerExists = await doesCustomerExist(stripe_id)
	return (
        <ScrollArea>
            <Container pr='3' px={{ initial: '3', xs: '0' }}>

                <Section>

					<InfosSettings teacher={user} profileData={profileData}/>
					
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
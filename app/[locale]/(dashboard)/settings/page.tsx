import { getTranslations } from 'next-intl/server';
import { fetchUser, fetchProfile } from '@/app/[locale]/_actions/user'
import { SignOutBtn } from './_buttons/SignOutBtn';
import { ResetPasswordBtn } from './_buttons/ResetPasswordBtn';
import { SubscribeBtn } from './_buttons/SubscribeBtn';
import { ManageSubscriptionBtn } from './_buttons/ManageSubscriptionBtn';
//import { doesCustomerExist } from '@/app/_stripe/services/customer';
import { Container, Section, Heading, DataList, Separator, Flex, Badge, Code, Card } from '@radix-ui/themes';
import { redirect } from '@/app/_intl/intlNavigation';


export default async function AccountPage() {
    const t = await getTranslations("settings")
    
    const user = await fetchUser()
    const isAnon = user.is_anonymous

    if (!user || isAnon) {
        redirect('/login')
        return null
    }


    const profile  = await fetchProfile(user.id)
    //const customerExists = profile.stripe_id && await doesCustomerExist(profile.stripe_id)

    return (
        <main style={{ padding: '2rem' }}>

            <Container size="3">

                <Section size='1' pt='0'>

                        <Heading as='h1' mb='2'>{t('information')}</Heading>

                        <Card size='4'>
                            <DataList.Root>
                                {/*<DataList.Item>
                                    <DataList.Label>{t("nickname")}</DataList.Label>
                                    <DataList.Value>{profile.nickname}</DataList.Value>
                                </DataList.Item>*/}
                                <DataList.Item>
                                    <DataList.Label>{t("name")}</DataList.Label>
                                    <DataList.Value>{profile.first_name}</DataList.Value>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.Label>{t("surname")}</DataList.Label>
                                    <DataList.Value>{profile.last_name}</DataList.Value>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.Label>{t("email")}</DataList.Label>
                                    <DataList.Value>{user?.email}</DataList.Value>
                                </DataList.Item>
                                {/*
                                <DataList.Item>
                                    <DataList.Label>{t("id")}</DataList.Label>
                                    <DataList.Value><Code>{user?.id}</Code></DataList.Value>
                            </DataList.Item>*/}
                            </DataList.Root>

                            <Separator size='4' my='4'/>

                            <Flex gap='4'>
                                <ResetPasswordBtn message={t("change password")}/>
                                {!isAnon && <SignOutBtn message={t("sign out")}/>}
                            </Flex>
                        </Card>

                </Section>

                <Section size='1'>
                    <Heading as='h1' mb='2'>{t('subscription')}</Heading>
                    <Card size='4'>

                        {/*
                        <DataList.Root>
                            <DataList.Item>
                                <DataList.Label>{t("customer exists")}</DataList.Label>
                                <DataList.Value>{customerExists ? <Badge color='green' radius='full'>yes</Badge> : <Badge color='red' radius='full'>no</Badge>}</DataList.Value>
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.Label>{t("stripe id")}</DataList.Label>
                                <DataList.Value><Code>{profile.stripe_id}</Code></DataList.Value>
                            </DataList.Item>
                        </DataList.Root>

                        <Separator size='4' my='4'/>
                        */}

                        <Flex gap='4'>
                            <SubscribeBtn message={t("subscribe")}/>
                            <ManageSubscriptionBtn message={t("manage subscription")}/>
                        </Flex>
                    </Card>
                </Section>

                {/*

                <Section size='1'>
                    <Heading as='h1' mb='2'>{'Software'}</Heading>
                    <Card size='4'>

                        <DataList.Root>
                            <DataList.Item>
                                <DataList.Label>{"Supabase URL"}</DataList.Label>
                                <DataList.Value>{process.env.NEXT_PUBLIC_SUPABASE_URL}</DataList.Value>
                            </DataList.Item>
                        </DataList.Root>

                    </Card>
                </Section>
                    */}

            </Container>

        </main>
    )
}
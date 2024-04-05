import { getTranslations } from 'next-intl/server';
import { fetchUser } from '@/supabase/services/auth';
import { fetchProfile } from '@/supabase/services/user_profiles';
import { SignOutBtn } from './_buttons/SignOutBtn';
import { ResetPasswordBtn } from './_buttons/ResetPasswordBtn';
import { SubscribeBtn } from './_buttons/SubscribeBtn';
import { ManageSubscriptionBtn } from './_buttons/ManageSubscriptionBtn';
import { doesCustomerExist } from '@/app/_stripe/services/customer';
import { Container, Section, Heading, DataList, Button, Separator, Flex, Badge } from '@radix-ui/themes';


export default async function AccountPage() {
    const t = await getTranslations("settings")
    
    const user = await fetchUser()
    const { data: profileData, error: profileError } = await fetchProfile(user.id)
    const {name, surname, stripe_id, nickname} = profileData?.[0] ?? {name: "no name", surname: "no surname", stripe_id: "no stripe_id", nickname: "no nickname"}
    const customerExists = await doesCustomerExist(stripe_id)

    const cardStyle: React.CSSProperties = {
        backgroundColor: 'var(--background)',
        padding: '2rem',
        borderRadius: '1rem',
    }

    return (
        <Container size="3">

            <Container size="3">

                <Section size='1'>
                    <Flex direction='column' gap='4' style={cardStyle}>
                        <Heading>{t('information')}</Heading>

                        <DataList.Root>
                            <DataList.Item>
                                <DataList.Label>{t("nickname")}</DataList.Label>
                                <DataList.Value>{nickname}</DataList.Value>
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.Label>{t("name")}</DataList.Label>
                                <DataList.Value>{name}</DataList.Value>
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.Label>{t("surname")}</DataList.Label>
                                <DataList.Value>{surname}</DataList.Value>
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.Label>{t("email")}</DataList.Label>
                                <DataList.Value>{user?.email}</DataList.Value>
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.Label>{t("id")}</DataList.Label>
                                <DataList.Value>{user?.id}</DataList.Value>
                            </DataList.Item>
                        </DataList.Root>

                        <Separator size='4'/>

                        <Flex gap='4'>
                            <ResetPasswordBtn message={t("change password")}/>
                            <SignOutBtn message={t("sign out")}/>
                        </Flex>
                    </Flex>
                </Section>

                <Section size='1'>
                    <Flex direction='column' gap='4' style={cardStyle}>
                        <Heading>{t('subscription')}</Heading>

                        <DataList.Root>
                            <DataList.Item>
                                <DataList.Label>{t("customer exists")}</DataList.Label>
                                <DataList.Value>{customerExists ? <Badge color='green' radius='full'>yes</Badge> : <Badge color='red' radius='full'>no</Badge>}</DataList.Value>
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.Label>{t("stripe id")}</DataList.Label>
                                <DataList.Value>{stripe_id}</DataList.Value>
                            </DataList.Item>
                        </DataList.Root>

                        <Separator size='4'/>

                        <Flex gap='4'>
                            <SubscribeBtn message={t("subscribe")}/>
                            <ManageSubscriptionBtn message={t("manage subscription")}/>
                        </Flex>
                    </Flex>
                </Section>

            </Container>

        </Container>
    )
}
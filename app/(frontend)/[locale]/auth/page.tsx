'use client'
import { Flex, Tabs, Container, Section, Card } from '@radix-ui/themes';
import useSearchParams from '@/app/(frontend)/_hooks/useSearchParams';
import SignUpForm from './_components/SignUpForm';
import LogInForm from './_components/LogInForm';
import RecoveryForm from './_components/RecoveryForm';
import ChangePasswordForm from './_components/ChangePasswordForm';


export default function Page() {
    const { searchParams, setSearchParam } = useSearchParams();
    const authTab = searchParams.get('authTab');

    const onChangeTab = (value: string) => {
        setSearchParam('authTab', value)
    }

    return (
        <Container size='1' height={'100vh'} style={{backgroundColor: 'var(--accent-2'}}>
            <Section>
                <Card>
                    <Flex direction='column' gap='2' p='5'>
                        <Tabs.Root value={authTab || 'signup'} onValueChange={onChangeTab}>

                            <Tabs.List justify='center'>
                                <Tabs.Trigger value='signup'>{"S'inscrire"}</Tabs.Trigger>
                                <Tabs.Trigger value={'login'}>{"Se connecter"}</Tabs.Trigger>
                                <Tabs.Trigger value='forgot-password' style={{ display: authTab == 'forgot-password' ? 'flex' : 'none' }}>{'Réinitialiser'}</Tabs.Trigger>
                                <Tabs.Trigger value='change-password' style={{ display: authTab == 'change-password' ? 'flex' : 'none' }}>{'Réinitialiser'}</Tabs.Trigger>
                            </Tabs.List>


                            <Tabs.Content value='signup'>
                                <SignUpForm />
                            </Tabs.Content>

                            <Tabs.Content value='login'>
                                <LogInForm />
                            </Tabs.Content>


                            <Tabs.Content value='forgot-password'>
                                <RecoveryForm />
                            </Tabs.Content>


                            <Tabs.Content value='change-password'>
                                <ChangePasswordForm />
                            </Tabs.Content>

                        </Tabs.Root>
                    </Flex>
                </Card>
            </Section>
        </Container>
    )
}
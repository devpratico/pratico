'use client'
import * as Form from '@radix-ui/react-form';
import { TextField, Flex } from '@radix-ui/themes';
import { Button, Tabs, Separator, Callout } from '@radix-ui/themes';
import { Mail, RectangleEllipsis, TriangleAlert, ArrowRight } from 'lucide-react';
import en from '@/app/_intl/messages/en.json';
import { login, signup, signInAnonymously } from './actions';
import signInWithGoogle from './signInWithGoogle';
import logger from '@/app/_utils/logger';
import { useRouter } from '@/app/_intl/intlNavigation';
import { useState } from 'react';


export default function AuthForm({ messages }: { messages: typeof en.AuthForm }) {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);


    const SocialProviders = () => {
        return (
            <Flex direction='column' gap='2' py='5'>
                <Button variant='soft' onClick={async () => {
                    setIsLoading(true);
                    try {
                        await signInWithGoogle({ redirectTo: window.location.origin + '/api/auth/callback' });
                        // We don't set the `next` searchParam so the default redirect(`/capsules`) is used - in the callback route
                    } catch (error) {
                        logger.error('supabase:auth', 'Error signing in with Google', (error as Error).message);
                        setServerError((error as Error).message);
                    }
                    setIsLoading(false);
                }}>
                    {messages['sign in with Google']}
                </Button>
                <Button variant='soft' disabled={true}>{messages['sign in with Apple']}</Button>
            </Flex>
        )
    }


    return (
        <Flex direction='column' gap='2'>
            <Tabs.Root defaultValue='signup'>

                <Tabs.List
                    justify='center'
                    onChange={() => {
                        setServerError(null)
                        setIsLoading(false)
                    }}
                >
                    <Tabs.Trigger value='signup'>{messages['sign up']}</Tabs.Trigger>
                    <Tabs.Trigger value='signin'>{messages['sign in']}</Tabs.Trigger>
                </Tabs.List>




                {/************ SIGN UP ************/}
                <Tabs.Content value='signup'>

                    <SocialProviders />
                    <Separator size='4' />

                    <Form.Root
                        onSubmit={async (event) => {
                            event.preventDefault();
                            setIsLoading(true);
                            const data = Object.fromEntries(new FormData(event.currentTarget));
                            const { email, password, 'confirm-password': confirmPassword } = data as { email: string, password: string, 'confirm-password': string };
                            if (password !== confirmPassword) {
                                setServerError(messages['passwords do not match']);
                                setIsLoading(false);
                                return;
                            }
                            try {
                                logger.log('supabase:auth', 'Signing up with email', email);
                                await signup({ email, password });
                                router.push('/capsules');
                            } catch (error) {
                                logger.error('supabase:auth', 'Error signing up with email', (error as Error).message);
                                setServerError((error as Error).message);
                                setIsLoading(false);
                            }
                        }}
                    >

                        <Flex direction='column' gap='5' pt='5'>

                            <Form.Field key='email' name='email'>
                                <Form.Control asChild>
                                    <TextField.Root placeholder={messages['email']} required> 
                                        <TextField.Slot><Mail /></TextField.Slot>
                                    </TextField.Root>
                                </Form.Control>
                            </Form.Field>

                            <Form.Field key='password' name='password'>
                                <Form.Control asChild>
                                    <TextField.Root placeholder={messages['password']} type="password" required>
                                        <TextField.Slot><RectangleEllipsis /></TextField.Slot>
                                    </TextField.Root>
                                </Form.Control>
                            </Form.Field>

                            <Form.Field key='confirm-password' name='confirm-password'>
                                <Form.Control asChild>
                                    <TextField.Root placeholder={messages['confirm password']} type="password" required>
                                        <TextField.Slot><RectangleEllipsis /></TextField.Slot>
                                    </TextField.Root>
                                </Form.Control>
                            </Form.Field>

                            <Button type="submit">{messages['sign up']}</Button>

                        </Flex>

                    </Form.Root>

                </Tabs.Content>





                {/************ SIGN IN ************/}
                <Tabs.Content value='signin'>

                    <SocialProviders />
                    <Separator size='4' />

                    <Form.Root
                        onSubmit={async (event) => {
                            event.preventDefault();
                            setIsLoading(true);
                            const data = Object.fromEntries(new FormData(event.currentTarget));
                            const { email, password } = data as { email: string, password: string };
                            try { 
                                logger.log('supabase:auth', 'Signing in with email', email);
                                await login({ email, password });
                                router.push('/capsules');
                            } catch (error) {
                                logger.error('supabase:auth', 'Error signing in with email', (error as Error).message);
                                setServerError((error as Error).message);
                                setIsLoading(false);
                            }
                        }}
                    >

                        <Flex direction='column' gap='5' pt='5'>

                            <Form.Field key='email' name='email'>
                                <Form.Control asChild>
                                    <TextField.Root placeholder={messages['email']} required> 
                                        <TextField.Slot><Mail /></TextField.Slot>
                                    </TextField.Root>
                                </Form.Control>
                            </Form.Field>

                            <Form.Field key='password' name='password'>
                                <Form.Control asChild>
                                    <TextField.Root placeholder={messages['password']} type="password" required>
                                        <TextField.Slot><RectangleEllipsis /></TextField.Slot>
                                    </TextField.Root>
                                </Form.Control>
                            </Form.Field>

                            <Form.Submit asChild>
                                <Button type="submit" loading={isLoading}>
                                    {messages['sign in']}
                                </Button>
                            </Form.Submit>

                        </Flex>

                    </Form.Root>
                </Tabs.Content>

            </Tabs.Root>

            {serverError &&
                <Callout.Root color='red'>
                    <Callout.Icon><TriangleAlert /></Callout.Icon>
                    <Callout.Text>{serverError}</Callout.Text>
                </Callout.Root>
            }

            <Button
                disabled={false}
                variant='soft'
                onClick={() => {
                    setIsLoading(true);
                    signInAnonymously()
                        .then(() => router.push('/capsules'))
                        .catch(error => {
                            logger.error('supabase:auth', 'Error signing in anonymously', (error as Error).message);
                            setServerError((error as Error).message);
                        })
                        .finally(() => setIsLoading(false));
                }}
            >
                {messages['try without an account']}
                <ArrowRight/>
            </Button>
        </Flex>
    )
}
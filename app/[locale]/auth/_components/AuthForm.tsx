'use client'
import * as Form from '@radix-ui/react-form';
import { TextField, Flex } from '@radix-ui/themes';
import { Button, Tabs, Separator, Callout } from '@radix-ui/themes';
import { Mail, RectangleEllipsis, TriangleAlert, ArrowRight } from 'lucide-react';
import en from '@/app/_intl/messages/en.json';
import { login, signup, signInAnonymously, isUserAnonymous, setNames } from '@/app/api/_actions/auth';
import signInWithGoogle from '../../../api/_actions/signInWithGoogle';
import logger from '@/app/_utils/logger';
import { useRouter, usePathname } from '@/app/_intl/intlNavigation';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AuthForm({ messages }: { messages: typeof en.AuthForm }) {
    const searchParams = useSearchParams();
    const authTab = searchParams.get('authTab');
    const nextUrl = searchParams.get('nextUrl');
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [isAnon, setIsAnon] = useState(false);

    useEffect(() => {
        //isLoggedIn().then((user) => {setIsLogged(!!user)})
        isUserAnonymous().then((anon) => {setIsAnon(!!anon)})
    }, []);


    const SocialProviders = () => {
        return (
            <Flex direction='column' gap='2' py='5'>
                <Button disabled variant='soft' onClick={async () => {
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
                {/*<Button variant='soft' disabled={true}>{messages['sign in with Apple']}</Button>*/}
            </Flex>
        )
    }


    return (
        <Flex direction='column' gap='2'>
            <Tabs.Root
                value={authTab || 'signup'}
                onValueChange={(value) => {

                    const params = new URLSearchParams(searchParams.toString())
                    params.set('authTab', value)
                    router.push(pathname + '?' + params.toString())
                    setServerError(null)
                    setIsLoading(false)
                }}
            >

                <Tabs.List justify='center'>
                    <Tabs.Trigger value='signup'>{messages['sign up']}</Tabs.Trigger>
                    <Tabs.Trigger value='login'>{messages['sign in']}</Tabs.Trigger>
                </Tabs.List>




                {/************ SIGN UP ************/}
                <Tabs.Content value='signup'>

                    {/*
                    <SocialProviders />
                    <Separator size='4' />
                    */}

                    <Form.Root
                        onSubmit={async (event) => {
                            event.preventDefault();
                            setIsLoading(true);

                            /*
                            interface SignUpFormData {
                                firstname: string
                                lastname: string
                                email: string
                                password: string
                                'confirm-password': string
                            }*/

                            const formData = Object.fromEntries(new FormData(event.currentTarget));

                            //const { firstname, lastname, email, password, 'confirm-password': confirmPassword } = data as unknown as SignUpFormData;
                            if (formData.password !== formData['confirm-password']) {
                                setServerError(messages['passwords do not match']);
                                setIsLoading(false);
                                return;
                            }

                            logger.log('supabase:auth', 'Signing up with email', formData.email);
                            const { user, error } = await signup({ email: (formData.email as string), password: (formData.password as string) });

                            if (error || !user) {
                                logger.error('supabase:auth', 'Error signing up with email', error);
                                setServerError( error || 'error signing up');
                                setIsLoading(false);

                            } else {
                                await setNames({ id: user.id, first_name: (formData.firstname as string), last_name: (formData.lastname as string) });
                                router.push(nextUrl || '/capsules');
                            }
                        }}
                    >

                        <Flex direction='column' gap='5' pt='5'>

                            <Form.Field key='firstname' name='firstname'>
                                <Form.Control asChild>
                                    <TextField.Root placeholder='Prénom' required>
                                    </TextField.Root>
                                </Form.Control>
                            </Form.Field>

                            <Form.Field key='lastname' name='lastname'>
                                <Form.Control asChild>
                                    <TextField.Root placeholder='Nom' required>
                                    </TextField.Root>
                                </Form.Control>
                            </Form.Field>

                            <Separator size='4' />

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

                            <Button
                                type="submit"
                                loading={isLoading}
                            >
                                {messages['sign up']}
                            </Button>

                        </Flex>

                    </Form.Root>

                </Tabs.Content>





                {/************ SIGN IN ************/}
                <Tabs.Content value='login'>

                    {/*
                    <SocialProviders />
                    <Separator size='4' />
                    */}

                    <Form.Root
                        onSubmit={async (event) => {
                            event.preventDefault();
                            setIsLoading(true);
                            const formData = Object.fromEntries(new FormData(event.currentTarget));
                            const { email, password } = formData as { email: string, password: string };
                            
                            logger.log('supabase:auth', 'Signing in with email', email);
                            const { user, error} = await login({ email, password });
                            
                            if (error || !user) {
                                logger.error('supabase:auth', 'Error signing in with email', error);
                                setServerError(error || 'error signing in');
                                setIsLoading(false);

                            } else {
                                router.push('/capsules');
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
                variant='ghost'
                disabled={false}
                loading={isLoading}
                onClick={() => {
                    setIsLoading(true);
                    // If already logged in a anonymously, don't sign in again (otherwise it creates a new anon account)
                    if (isAnon) {
                        router.push(nextUrl || '/capsules');
                        return
                    }

                    signInAnonymously()
                        .then(() => router.push(nextUrl || '/capsules'))
                        .catch(error => {
                            logger.error('supabase:auth', 'Error signing in anonymously', (error as Error).message);
                            setServerError((error as Error).message);
                            setIsLoading(false);
                        })
                }}
            >
                {messages['ignore']}
                <ArrowRight />
            </Button>





        </Flex>
    )
}
'use client'
import { Button, Flex, TextField } from '@radix-ui/themes';
import * as Form from '@radix-ui/react-form';
import { Mail, RectangleEllipsis, TriangleAlert } from 'lucide-react';
import { signup } from '@/app/(backend)/api/auth/auth.client';
import { useRouter } from '@/app/(frontend)/_intl/intlNavigation';
import { useDisable } from '@/app/(frontend)/_hooks/useDisable';
import logger from '@/app/_utils/logger';
import useSearchParams from '@/app/(frontend)/_hooks/useSearchParams';
import TryAnonymousBtn from './TryAnonymousBtn';
import { useState } from 'react';
import Feedback from './Feedback';
import ClientMismatchMessage from './ClientMismatchMessage';
import { sendDiscordMessage } from '@/app/(backend)/api/discord/discord.client';
import { setNames } from '@/app/(backend)/api/user/user.client';



export default function SignUpForm() {
    const { searchParams } = useSearchParams();
    const nextUrl = searchParams.get('nextUrl');
    const router = useRouter();
    const { disabled, setDisabled } = useDisable();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage(null);
        setIsLoading(true);
        setDisabled(true);

        const formData = Object.fromEntries(new FormData(event.currentTarget));

        //const { firstname, lastname, email, password, 'confirm-password': confirmPassword } = data as unknown as SignUpFormData;
        if (formData.password !== formData['confirm-password']) {
            setErrorMessage('Les mots de passe ne correspondent pas');
            setIsLoading(false);
            setDisabled(false);
            return;
        }

        logger.log('supabase:auth', 'Signing up with email', formData.email);
        const { user, error } = await signup({ email: (formData.email as string), password: (formData.password as string) });

        if (error || !user) {
            logger.error('supabase:auth', 'Error signing up with email', error);
            setErrorMessage(error || 'error signing up');
            setIsLoading(false);
            setDisabled(false);

        } else {
            await setNames({ id: user.id, first_name: (formData.firstname as string), last_name: (formData.lastname as string) });
            sendDiscordMessage(`🎉 **Nouvel inscrit !** ${formData.firstname} ${formData.lastname} (${formData.email})`);

            if (nextUrl == '/capsule') {
                router.push('/capsules');
            } else {
                router.push(nextUrl || '/capsules');
            }
        }
    }


    return (
        <Form.Root onSubmit={onSubmit}>

            <Flex direction='column' gap='2' pt='5'>

                <Form.Field key='firstname' name='firstname'>
                    <Form.Control asChild>
                        <TextField.Root placeholder='Prénom' required disabled={disabled}>
                        </TextField.Root>
                    </Form.Control>
                    <ClientMismatchMessage match='valueMissing' message='Veuillez renseigner un prénom' />
                </Form.Field>

                <Form.Field key='lastname' name='lastname'>
                    <Form.Control asChild>
                        <TextField.Root placeholder='Nom' required>
                        </TextField.Root>
                    </Form.Control>
                    <ClientMismatchMessage match='valueMissing' message='Veuillez renseigner un nom' />
                </Form.Field>

                <Form.Field key='email' name='email'>
                    <Form.Control asChild>
                        <TextField.Root mt='4' placeholder='Email' required disabled={disabled} type='email'>
                            <TextField.Slot><Mail /></TextField.Slot>
                        </TextField.Root>
                    </Form.Control>
                    <ClientMismatchMessage match='valueMissing' message='Veuillez renseigner un email' />
                    <ClientMismatchMessage match='typeMismatch' message='Email non valide' />
                </Form.Field>

                <Form.Field key='password' name='password'>
                    <Form.Control asChild>
                        <TextField.Root placeholder={'Mot de passe'} type="password" required disabled={disabled}>
                            <TextField.Slot><RectangleEllipsis /></TextField.Slot>
                        </TextField.Root>
                    </Form.Control>
                    <ClientMismatchMessage match='valueMissing' message='Veuillez entrer un mot de passe' />
                </Form.Field>

                <Form.Field key='confirm-password' name='confirm-password'>
                    <Form.Control asChild>
                        <TextField.Root placeholder={'Confirmer le mot de passe'} type="password" required disabled={disabled}>
                            <TextField.Slot><RectangleEllipsis /></TextField.Slot>
                        </TextField.Root>
                    </Form.Control>
                    <ClientMismatchMessage match='valueMissing' message='Veuillez confirmer le mot de passe' />
                </Form.Field>

                <Button type="submit" loading={isLoading} disabled={disabled} mt='4'>{"S'inscrire"}</Button>

                { errorMessage && <Feedback color='orange' message={errorMessage} icon={<TriangleAlert />} /> }

                <TryAnonymousBtn />

            </Flex>

        </Form.Root>
    )
}


/*
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
                        setErrorMessage((error as Error).message);
                    }
                    setIsLoading(false);
                }}>
                    {messages['sign in with Google']}
                </Button>
                <Button variant='soft' disabled={true}>{messages['sign in with Apple']}</Button>
            </Flex >
        )
    }
*/
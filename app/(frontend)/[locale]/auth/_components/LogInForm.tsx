'use client'
import { Button, Flex, TextField, Link, Text } from '@radix-ui/themes';
import * as Form from '@radix-ui/react-form';
import { Mail, RectangleEllipsis, TriangleAlert } from 'lucide-react';
import { login } from '@/app/(backend)/api/auth/auth.client';
import logger from '@/app/_utils/logger';
import { useRouter } from '@/app/(frontend)/_intl/intlNavigation';
import useSearchParams from '@/app/(frontend)/_hooks/useSearchParams';
import { useDisable } from '@/app/(frontend)/_hooks/useDisable';
import TryAnonymousBtn from './TryAnonymousBtn';
import { useState } from 'react';
import Feedback from './Feedback';
import ClientMismatchMessage from './ClientMismatchMessage';
//import { sendDiscordMessage } from '@/app/(backend)/api/discord/wrappers';


export default function LogInForm() {
    const router = useRouter();
    const { getPathnameWithSearchParam } = useSearchParams();
    const { disabled, setDisabled } = useDisable();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);


    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setDisabled(true);
        setErrorMessage(null);

        const formData = Object.fromEntries(new FormData(event.currentTarget));
        const { email, password } = formData as { email: string, password: string };

        logger.log('supabase:auth', 'Signing in with email', email);
        const { user, error } = await login({ email, password });
        setDisabled(false);
        setIsLoading(false);

        if (error || !user) {
            logger.error('supabase:auth', 'Error signing in with email', error);
            setErrorMessage(error || 'error signing in');
            
        } else {
            //sendDiscordMessage(`🔑 **Connexion** de __${email}__`);
            router.push('/capsules');
        }
    }


    return (
        <Form.Root onSubmit={onSubmit}>

            <Flex direction='column' gap='2' mt='5'>

                <Form.Field key='email' name='email'>
                    <Form.Control asChild>
                        <TextField.Root placeholder={"Email"} required disabled={disabled} type='email'>
                            <TextField.Slot><Mail /></TextField.Slot>
                        </TextField.Root>
                    </Form.Control>

                    <ClientMismatchMessage match='valueMissing' message='Veuillez renseigner un email' />
                    <ClientMismatchMessage match='typeMismatch' message='Email non valide' />
                </Form.Field>

                <Form.Field key='password' name='password'>
                    <Form.Control asChild>
                        <TextField.Root placeholder={"Mot de passe"} type="password" required disabled={disabled}>
                            <TextField.Slot><RectangleEllipsis /></TextField.Slot>
                        </TextField.Root>
                    </Form.Control>
                    <ClientMismatchMessage match='valueMissing' message='Veuillez entrer un mot de passe' />
                </Form.Field>

                <Form.Submit asChild>
                    <Button type="submit" mt='4' loading={isLoading} disabled={disabled}>
                        {"Se connecter"}
                    </Button>
                </Form.Submit>

                <Link size='2' href={getPathnameWithSearchParam('authTab', 'forgot-password')}>
                    {"Mot de passe oublié ?"}
                </Link>

                {errorMessage && <Feedback color='orange' icon={<TriangleAlert />} message={errorMessage} />}

                <TryAnonymousBtn mt='5'/>

            </Flex>

        </Form.Root>
    )
}
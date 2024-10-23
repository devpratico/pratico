'use client'
import { Button, Flex, TextField, Text } from '@radix-ui/themes';
import * as Form from '@radix-ui/react-form';
import { Mail, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import sendDiscordMessage from '@/app/(backend)/api/discord/send-message/client';
import Feedback from './Feedback';
import { useDisable } from '@/app/(frontend)/_hooks/useDisable';
import ClientMismatchMessage from './ClientMismatchMessage';
import createClient from '@/supabase/clients/client';


export default function RecoveryForm() {
    const { disabled, setDisabled } = useDisable();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setDisabled(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        const formData = Object.fromEntries(new FormData(e.currentTarget));
        const { email } = formData as { email: string };
        
        const supabase = createClient()
        const { error } = await supabase.auth.resetPasswordForEmail(email)

        setDisabled(false);


        if (!error) {
            setSuccessMessage('Un email de réinitialisation a été envoyé à cette adresse. Vérifiez vos spams !');
        } else {
            const fullMessage = error.name + ': ' + error.message + error.cause ? ' - ' + error.cause : '';
            setErrorMessage(fullMessage);
            sendDiscordMessage(`⚠️ _${email}_ a voulu réinitialiser son mot de passe mais une erreur est survenue : *"${fullMessage}"*`);
        }
    }

    return (
        <Form.Root onSubmit={handleSubmit}>
            <Flex direction='column' gap='5' pt='5'>

                <Form.Field key='email' name='email'>

                    <Form.Control asChild>
                        <TextField.Root placeholder={'Email'} type='email' disabled={disabled} required>
                            <TextField.Slot><Mail /></TextField.Slot>
                        </TextField.Root>
                    </Form.Control>

                    <ClientMismatchMessage match='valueMissing' message='Veuillez renseigner un email' />
                    <ClientMismatchMessage match='typeMismatch' message='Email non valide' />

                </Form.Field>


                <Form.Submit asChild >
                    <Button type='submit' loading={disabled}>Envoyer</Button>
                </Form.Submit>

                {errorMessage && <Feedback color='orange' message={errorMessage} icon={<TriangleAlert />} />}
                {successMessage && <Feedback color='green' message={successMessage} icon={<Mail />} />}

            </Flex>
        </Form.Root>
    )
}
'use client'
import { Flex, TextField, Button } from "@radix-ui/themes"
import * as Form from "@radix-ui/react-form"
import { RectangleEllipsis, Eye, EyeOff } from "lucide-react"
import { MouseEventHandler, useState } from "react"
import Feedback from "./Feedback"
import { updateUserPassword } from "@/app/(backend)/api/auth/auth.client"
import { useDisable } from "@/app/(frontend)/_hooks/useDisable"
import ClientMismatchMessage from "./ClientMismatchMessage"
import { useRouter } from "@/app/(frontend)/_intl/intlNavigation"
import { sendDiscordMessage } from "@/app/(backend)/api/discord/discord.client"
import { useAuth } from "@/app/(frontend)/_hooks/useAuth"



export default function ChangePasswordForm() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage ] = useState<string | null>(null);
    const [showPasswords, setShowPasswords] = useState<boolean>(false);
    const { disabled, setDisabled } = useDisable();
    const { user } = useAuth();


    const handleShowPasswords = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setShowPasswords((prev) => !prev);
    }

    const passwordsNotIdentical: (value: string, formData: FormData) => boolean = (value, formData) => {
        const { password1, password2 } = Object.fromEntries(formData) as { password1: string, password2: string };
        return password1 !== password2;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);
        const formData = Object.fromEntries(new FormData(e.currentTarget));
        const { password1, password2 } = formData as { password1: string, password2: string };
    
        setDisabled(true);
        const { error } = await updateUserPassword(password1);
    
        if (error) { 
            setErrorMessage(error);

        } else {
            setSuccessMessage('Mot de passe mis à jour avec succès. Vous allez être redirigé vers votre dashboard.');
            sendDiscordMessage(`🔑 **Changement de mot de passe** pour ${user?.email}`)
            setTimeout(() => {
                setDisabled(false);
                router.push('/capsules');
            }, 3000);
            
        }
        setDisabled(false);
    };


    return (
        <Form.Root onSubmit={handleSubmit}>
            <Flex direction='column' gap='2' mt='5'>

                <Form.Field key='password1' name='password1'>

                    <Form.Control asChild>
                        <TextField.Root placeholder={"Mot de passe"} type={showPasswords ? 'text' : 'password'} required disabled={disabled}>
                            <TextField.Slot><RectangleEllipsis /></TextField.Slot>
                            <TextField.Slot>
                                <ShowPasswordButton show={showPasswords} onClick={handleShowPasswords} />
                            </TextField.Slot>  
                        </TextField.Root>
                    </Form.Control>

                    <ClientMismatchMessage match='valueMissing' message='Veuillez renseigner votre mot de passe' />

                </Form.Field>


                <Form.Field key='password2' name='password2'>

                    <Form.Control asChild>
                        <TextField.Root placeholder={"Confirmez le mot de passe"} type={showPasswords ? 'text' : 'password'} required disabled={disabled}>
                            <TextField.Slot><RectangleEllipsis /></TextField.Slot>
                            <TextField.Slot>
                                <ShowPasswordButton show={showPasswords} onClick={handleShowPasswords} />
                            </TextField.Slot>  
                        </TextField.Root>
                    </Form.Control>

                    <ClientMismatchMessage match='valueMissing' message='Veuillez confirmer le mot de passe' />
                    <ClientMismatchMessage match={passwordsNotIdentical} message='Les mots de passe ne sont pas identiques' />

                </Form.Field>

                <Form.Submit asChild>
                    <Button type='submit' mt='4' loading={disabled}>Changer le mot de passe</Button>
                </Form.Submit>

                {errorMessage && <Feedback color='orange' message={errorMessage} />}
                {successMessage && <Feedback color='green' message={successMessage} />}

            </Flex>
        </Form.Root>
    )
}


function ShowPasswordButton({ show, onClick }: { show: boolean, onClick: MouseEventHandler<HTMLButtonElement> }) {
    const { disabled } = useDisable();
    const iconSize = 20;
    return (
        <Button onClick={onClick} variant='ghost' size='1' color='gray' disabled={disabled}>
            {show ? <EyeOff size={iconSize} /> : <Eye size={iconSize} />}
        </Button>
    )
}
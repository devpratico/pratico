import { Button, Flex, TextField } from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";
import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import createClient from "@/supabase/clients/server";

export default function PasswordForgottenBtn() {
    const [ email, setEmail ] = useState('');
    const supabase = createClient();

    useEffect(() => {
        supabase.auth.onAuthStateChange(async (event, session) => {
                if (event == "PASSWORD_RECOVERY") {
                let newPassword: string | undefined | null = prompt("What would you like your new password to be?");
                if (!newPassword) {
                    console.error('Le nouveau mot de passe est invalide');
                    newPassword = undefined;
                }
                const { data, error } = await supabase.auth
                    .updateUser({ password: newPassword })

                if (data) alert("Password updated successfully!")
                if (error) alert("There was an error updating your password.")
            }
        })
    }, [])

    const handleClick = async () => {
        const { data, error } = await supabase.auth
            .resetPasswordForEmail(email)
    };

    return (<>
           <Flex direction='column' gap='5' pt='5'>
 
                <Form.Field key='email' name='email'>
                    <Form.Control asChild>
                        <TextField.Root placeholder={'email'}
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                        required>
                            <TextField.Slot><Mail /></TextField.Slot>
                        </TextField.Root>
                    </Form.Control>
                </Form.Field>
                <Form.Submit asChild >
                    <Button onClick={handleClick}>
                        Envoyer
                    </Button>
                </Form.Submit>

                </Flex>
    </>);
};
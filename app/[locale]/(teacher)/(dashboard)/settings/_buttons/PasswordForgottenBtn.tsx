import { Button, Flex, TextField } from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";
import { SetStateAction, useEffect, useState } from "react";
import { Mail } from "lucide-react";
import createClient from "@/supabase/clients/client";
import { Link, useRouter } from "@/app/_intl/intlNavigation";

export default function PasswordForgottenBtn({ clicked, onClick }:{ clicked: boolean, onClick: React.Dispatch<SetStateAction<boolean>>}) {
    const [ email, setEmail ] = useState('');
    const [ open, setOpen ] = useState(false);
    const [ reset, setReset ] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('EVENT:', event);
            if (event == "PASSWORD_RECOVERY") {
                router.push('/auth');
            }
        })
    }, [reset])

    const handleClick = async () => {
        onClick(true);
        try {
            const { data, error } = await supabase.auth
                .resetPasswordForEmail(email, {
                    redirectTo: 'http://localhost:3000/auth/update-password'
                });
            if (data)
            {    
                console.log('Reset password data:', data);
                setReset(true);
            }
            else if (error)
                throw new Error('Error reset password:', error);
        } catch (error) {
            console.error('Error reset password:', error);
        }
    };

    return (<>
    {
        (!open && !clicked)
        ?   <Link onClick={() => { onClick(true); setOpen(true)}} style={{ cursor: 'pointer' }} href='#'>Mot de passe oublié ?</Link>
        :  <Flex direction='column' gap='5' pt='5'>
 
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
    }
            
    </>);
};
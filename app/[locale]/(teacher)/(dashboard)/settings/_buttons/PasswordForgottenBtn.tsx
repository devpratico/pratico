import { Button, Flex, TextField } from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";
import { SetStateAction, useState } from "react";
import { Mail } from "lucide-react";
import { Link } from "@/app/_intl/intlNavigation";
import { Link as RadixLink } from "@radix-ui/themes";
import createClient from "@/supabase/clients/client";

export default function PasswordForgottenBtn({ clicked, onClick }:{ clicked: boolean, onClick: React.Dispatch<SetStateAction<boolean>>}) {
    const [ email, setEmail ] = useState('');

	const supabase = createClient();
	
	const getURL = () => {
		let url =
		  process?.env?.NEXT_PUBLIC_SITE_URL ??
		  process?.env?.NEXT_PUBLIC_VERCEL_URL ??
		  'http://localhost:3000/';
		url = url.startsWith('http') ? url : `https://${url}`;
		url = url.endsWith('/') ? url : `${url}/`;
		return (url);
	  }
	const redirectTo = `${getURL()}`;

    const handleClick = async () => {
		
	const { error } = await supabase.auth
		.resetPasswordForEmail(email, {
			redirectTo: redirectTo
		});
		if (!error)
			alert('Un mail de réinitialisationde mot de passe vous a été envoyé. Vérifiez vos spams');
    };

    return (<>
    {
        (!clicked)
        ?   <RadixLink asChild>
				<Link onClick={() => onClick(!clicked)} style={{ cursor: 'pointer' }} href='#'>
						Mot de passe oublié ?
				</Link>
			</RadixLink>
        :  	<Flex direction='column' gap='5' pt='5'>
                <Form.Field key='email' name='email'>
                    <Form.Control asChild>
                        <TextField.Root placeholder={'Email'}
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
							}}
							required>
                            <TextField.Slot><Mail /></TextField.Slot>
                        </TextField.Root>
                    </Form.Control>
					
					<RadixLink asChild>
						<Link onClick={() => onClick(!clicked)} style={{ cursor: 'pointer' }} href='#'>
								Se connecter ?							
						</Link>
					</RadixLink>

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
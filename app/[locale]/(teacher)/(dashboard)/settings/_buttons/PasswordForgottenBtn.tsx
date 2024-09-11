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
	const redirectTo = `${getURL()}auth/update-password`;

    const handleClick = async () => {
		
		try {
			const { data, error } = await supabase.auth
				.resetPasswordForEmail(email, {
					redirectTo: redirectTo // Utile en local uniquement
				});
			if (data)
				console.log('Reset password data:', data, 'host:', redirectTo);
			else
				console.log("No data to reset");
		} catch (error) {
			console.error('Error reset password:', error);
		}
		
    };

    return (<>
    {
        (!clicked)
        ?   <Link onClick={() => onClick(!clicked)} style={{ cursor: 'pointer' }} href='#'>
				{/* <RadixLink> */}
					Mot de passe oublié ?
				{/* </RadixLink> */}
			</Link>
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
					
					<Link onClick={() => onClick(!clicked)} style={{ cursor: 'pointer' }} href='#'>
						{/* <RadixLink> */}
							Se connecter ?							
						{/* </RadixLink> */}
					</Link>

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
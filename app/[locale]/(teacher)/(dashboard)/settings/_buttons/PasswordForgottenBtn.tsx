import { Button, Flex, TextField } from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";
import { SetStateAction, useState } from "react";
import { Mail } from "lucide-react";
import { Link } from "@/app/_intl/intlNavigation";
import createClient from "@/supabase/clients/client";

export default function PasswordForgottenBtn({ clicked, onClick }:{ clicked: boolean, onClick: React.Dispatch<SetStateAction<boolean>>}) {
    const [ email, setEmail ] = useState('');
	const redirectTo = `${window.location.protocol}//${window.location.host}/auth/update-password`;
	const supabase = createClient();

	// A garder !!
	
	// const getURL = () => {
	// 	let url =
	// 	  process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
	// 	  process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
	// 	  'http://localhost:3000/'
	// 	// Make sure to include `https://` when not localhost.
	// 	url = url.startsWith('http') ? url : `https://${url}`
	// 	// Make sure to include a trailing `/`.
	// 	url = url.endsWith('/') ? url : `${url}/`
	// 	return url
	//   }


    const handleClick = async () => {
		
		try {
			const { data, error } = await supabase.auth
				.resetPasswordForEmail(email, {
					redirectTo: redirectTo
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
        ?   <Link onClick={() => onClick(!clicked)} style={{ cursor: 'pointer' }} href='#'>Mot de passe oublié ?</Link>
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
					
					<Link onClick={() => onClick(!clicked)} style={{ cursor: 'pointer' }} href='#'>Se connecter ?</Link>

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
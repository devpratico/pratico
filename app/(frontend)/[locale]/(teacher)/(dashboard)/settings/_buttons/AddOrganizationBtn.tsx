'use client'
import { Button, Flex, TextField, Link } from '@radix-ui/themes';
import * as Form from '@radix-ui/react-form';
import { Building2, Mail, MapPin, RectangleEllipsis, TriangleAlert } from 'lucide-react';
import { login } from '@/app/(backend)/api/actions/auth';
import logger from '@/app/_utils/logger';
import { useRouter } from '@/app/(frontend)/_intl/intlNavigation';
import useSearchParams from '@/app/(frontend)/_hooks/useSearchParams';
import { useDisable } from '@/app/(frontend)/_hooks/useDisable';
import { useState } from 'react';

//import { sendDiscordMessage } from '@/app/(backend)/api/discord/wrappers';


export default function AddOrganizationBtn() {
	const [ isLoading, setIsLoading ] = useState(false);
	const [ clicked, setClicked ] = useState(false);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        const formData = Object.fromEntries(new FormData(event.currentTarget));
        const { email, password } = formData as { email: string, password: string };

        logger.log('supabase:auth', 'Signing in with email', email);
		// HERE add in supabase
        setIsLoading(false);

    }


    return (
		!clicked
		? <Button onClick={() => setClicked(true)}>Ajouter une organisation</Button>
       	: <Form.Root onSubmit={onSubmit}>

            <Flex direction='column' gap='2' mt='5'>

                <Form.Field key='name' name='name'>
                    <Form.Control asChild>
                        <TextField.Root placeholder={"Nom"} required type='text'>
                            <TextField.Slot><Building2 /></TextField.Slot>
                        </TextField.Root>
                    </Form.Control>

                </Form.Field>

                <Form.Field key='address' name='adress'>
                    <Form.Control asChild>
                        <TextField.Root placeholder={"Adresse"} type="text" >
                            <TextField.Slot><MapPin /></TextField.Slot>
                        </TextField.Root>
                    </Form.Control>
                </Form.Field>
				<Flex>
					<Form.Submit asChild>
						<Button type="submit" mt='4' loading={isLoading}>
							{"Ajouter"}
						</Button>
					</Form.Submit>
					<Button mt='4' ml='1'onClick={() => setClicked(false)}>Annuler</Button>

				</Flex>
				

            </Flex>

        </Form.Root>
    )
}
'use client'
import { Button, Flex, TextField } from '@radix-ui/themes';
import * as Form from '@radix-ui/react-form';
import { Building2, MapPin, } from 'lucide-react';
import logger from '@/app/_utils/logger';
import { useState } from 'react';
import createClient from '@/supabase/clients/client';
import { useRouter } from '@/app/(frontend)/_intl/intlNavigation';


export default function AddOrganizationBtn ({userId}: {userId: string | undefined}) {
	const supabase = createClient();
	const router = useRouter();
	const [ isLoading, setIsLoading ] = useState(false);
	const [ clicked, setClicked ] = useState(false);
	if (!userId)
		return ;
    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        const formData = Object.fromEntries(new FormData(event.currentTarget));
        const { name, address } = formData as { name: string, address: string };
		console.log("address", address)
		const organization = {
			name: name,
			address: address
		};
        logger.log('supabase:auth', 'Add organization name and address', name, address);
		const { data, error } = await supabase.from("user_profiles").update({organization}).eq("id", userId).select();
		console.log("error", error, "data:", data);
        setIsLoading(false);
		router.push("/settings");


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

                <Form.Field key='address' name='address'>
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
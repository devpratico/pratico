'use client'
import * as Form from '@radix-ui/react-form';
import { TextField, Button, Flex, Box, Text, Checkbox } from '@radix-ui/themes';
import { signInAnonymously } from '@/app/api/_actions/auth';
import { fetchUser } from '@/app/api/_actions/user';
import { useState } from 'react';
import logger from '@/app/_utils/logger';
import { useSearchParams, useRouter } from 'next/navigation';
import { createAttendance } from '@/app/api/_actions/attendance';


export default function StudentForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const nextUrl = searchParams.get('nextUrl');
	let roomCode: string | undefined; 
	// QUESTION: is that ok ?
	Array.from(searchParams.entries()).find((elem) => {
		if (elem[1].includes('classroom'))
			roomCode = elem[1].split('/').pop();
	});
    const [isLoading, setIsLoading] = useState(false);
	const [checked, setChecked] = useState(false); // accept to share your infos

    return (
        <Form.Root onSubmit={async (event) => {
            event.preventDefault();

			setIsLoading(true);
			const formData = new FormData(event.currentTarget);

			// Fetch user or sign in anonymously
			const user = (await fetchUser()).user || (await signInAnonymously()).data.user;
			if (!user) {
				logger.error('next:page', 'Impossible to fetch user or sign in anonymously');
				return;
			}

			const firstName = formData.get('first-name') as string;
			const lastName  = formData.get('last-name')  as string;
			await createAttendance(firstName, lastName, roomCode);
			if (nextUrl) {
				router.push(nextUrl);
			} else {
				logger.error('next:page', 'No nextUrl found in query params');
				router.push('/classroom');
			}

        }}>
            <Flex direction='column' gap='3'>
                <Form.Field key='first-name' name='first-name'>
                    <Form.Control asChild>
                        <TextField.Root placeholder='Prénom' required/>
                    </Form.Control>
                </Form.Field>

                <Form.Field key='last-name' name='last-name'>
                    <Form.Control asChild>
                        <TextField.Root placeholder='Nom' required/>
                    </Form.Control>
                </Form.Field>

				<Box maxWidth="250px">
					<Flex gap="2">
						<Checkbox defaultChecked onCheckedChange={() => setChecked(!checked)} required/>
						<Text size='1'>{"*J'accepte de partager ces informations avec l'animateur."}</Text>
					</Flex>
				</Box>

                <Box style={{alignSelf: 'flex-end'}}>
                    <Button type="submit" loading={isLoading}>OK</Button>
                </Box>
            </Flex>
        </Form.Root>
    )
}
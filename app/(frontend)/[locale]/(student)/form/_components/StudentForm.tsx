'use client'
import * as Form from '@radix-ui/react-form';
import { TextField, Button, Flex, Box, Text, Checkbox, Link, ScrollArea } from '@radix-ui/themes';
import { signInAnonymously } from '@/app/(backend)/api/actions/auth';
import { fetchUser } from '@/app/(backend)/api/actions/user';
import { useState } from 'react';
import logger from '@/app/_utils/logger';
import { useSearchParams, useRouter } from 'next/navigation';
import { createAttendance } from '@/app/(backend)/api/actions/attendance';
import { janifera } from '@/app/(frontend)/Fonts';


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
	const [checked, setChecked] = useState({accept: false, submit: false}); // accept CGU
	const [ name, setName ] = useState({firstname: "", lastname: ""});

	const acceptCGU = () => {
		if (checked.submit)
			return (checked.accept);
		return (true);
	};

    return (
        <Form.Root onSubmit={async (event) => {
            event.preventDefault();

			setIsLoading(true);
			// setChecked({...checked, submit: true});
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
                        <TextField.Root onChange={(e) => {
							if (e.target.value.length < 140)
								setName({...name, firstname: e.target.value})
							}}
							placeholder='Prénom' required/>
                    </Form.Control>
                </Form.Field>

                <Form.Field key='last-name' name='last-name'>
                    <Form.Control asChild>
                        <TextField.Root onChange={(e) =>  {
								if (e.target.value.length < 140)
									setName({...name, lastname: e.target.value})
							}}
							placeholder='Nom' required/>
                    </Form.Control>
                </Form.Field>

				<Box maxWidth="250px">
					<Flex gap="2">
						<Checkbox onCheckedChange={() => setChecked({submit: false, accept: !checked.accept})} required />
							<Link style={{color: acceptCGU() ? 'none' : '#E53939'}} size='1' href='https://www.pratico.live/conditions-generales-dutilisation-et-de-vente'>
								{"*J'accepte les conditions générales d'utilisation (CGU)."}
							</Link>
					</Flex>
				</Box>

				<Flex mt='5' justify='between' height='20px'>
					<Text mr='5' size='8' className={janifera.className}>{`${name.firstname} ${name.lastname}`}</Text>

					<Button onClick={() => setChecked({...checked, submit: true})} type="submit" loading={isLoading}>OK</Button>
				</Flex>
            </Flex>
        </Form.Root>
    )
}
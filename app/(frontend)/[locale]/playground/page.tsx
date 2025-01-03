'use client'
import * as Form from '@radix-ui/react-form';
import { TextField, Button, Flex, Box, Text, Checkbox, Link, TextArea } from '@radix-ui/themes';
import { signInAnonymously } from '@/app/(backend)/api/auth/auth.client';
import { fetchUser } from '@/app/(backend)/api/user/user.client';
import { useState } from 'react';
import logger from '@/app/_utils/logger';
import { createAttendance } from '@/app/(backend)/api/attendance/attendance.client';
import { janifera } from '@/app/(frontend)/Fonts';


export default function PlayGround () {
	// if (process.env.NODE_ENV === 'production') {
	// 	return (null);
	// }

	const [checked, setChecked] = useState({accept: false, submit: false}); // accept CGU
	const [ name, setName ] = useState({firstname: "", lastname: ""});
	const [ error, setError ] = useState<string | null>(null);

	const acceptCGU = () => {
		if (checked.submit)
			return (checked.accept);
		return (true);
	};

	if (error) throw new Error(error);

    return (
        <Form.Root onSubmit={async (event) => {
            event.preventDefault();

			const formData = new FormData(event.currentTarget);
			const roomCode = "0066";
			
            // Il reste de la place, on peut continuer
			const user = (await fetchUser()).user || (await signInAnonymously()).data.user;			// If user is not logged in, sign in anonymously
            if (!user) {
				logger.error('supabase:auth', 'StudentForm', 'Impossible to sign in anonymously', error);
				setError('Impossible de se connecter. Veuillez réessayer plus tard.');
				return;
			}

            if (!user) {
                logger.error('next:page', 'StudentForm', 'User not found after sign in anonymously');
                setError('Impossible de se connecter. Veuillez réessayer plus tard.');
                return;
            }
			
            const firstName = formData.get('first-name') as string;
            const lastName = formData.get('last-name') as string;
            let info = formData.get('additional-info') as string;
            if (info.trim().length === 0)
                info = "";
            await createAttendance(firstName, lastName, roomCode, user.id, info);
            			
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

                <Form.Field key='additional-info' name='additional-info'>
                    <Form.Control asChild>
                        <TextArea 
							placeholder='Informations supplémentaires (facultatif)'/>
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

					<Button onClick={() => setChecked({...checked, submit: true})} type="submit">OK</Button>
				</Flex>
            </Flex>
        </Form.Root>
    )
};


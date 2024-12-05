'use client'
import * as Form from '@radix-ui/react-form';
import { TextField, Button, Flex, Box, Text, Checkbox, Link } from '@radix-ui/themes';
import { signInAnonymously } from '@/app/(backend)/api/auth/auth.client';
//import { fetchUser } from '@/app/(backend)/api/user/user.client';
import { useUser } from '@/app/(frontend)/_hooks/useUser';
import { useState } from 'react';
import logger from '@/app/_utils/logger';
import { useSearchParams, useRouter } from 'next/navigation';
import { createAttendance, isAttendancesLimitReached } from '@/app/(backend)/api/attendance/attendance.client';
import { janifera } from '@/app/(frontend)/Fonts';
import { revalidatePath } from 'next/cache';


export default function StudentForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const nextUrl = searchParams.get('nextUrl');
    const roomCode = nextUrl?.split('/').pop();

    const [isLoading, setIsLoading] = useState(false);
	const [checked, setChecked] = useState({accept: false, submit: false}); // accept CGU
	const [ name, setName ] = useState({firstname: "", lastname: ""});
	const [ error, setError ] = useState<string | null>(null);
    const { user } = useUser();

	const acceptCGU = () => {
		if (checked.submit)
			return (checked.accept);
		return (true);
	};

	if (error) throw new Error(error);
    if (!nextUrl) throw new Error('nextUrl not found in query params');
    if (!roomCode) throw new Error('Room code not found in query params');

    return (
        <Form.Root onSubmit={async (event) => {
            event.preventDefault();

			setIsLoading(true);
			const formData = new FormData(event.currentTarget);
            const { isReached } = await isAttendancesLimitReached(roomCode);

            if (isReached) {
                setError('Le nombre maximum de participants est atteint (10). Veuillez contacter l\'organisateur pour obtenir un accès.');
                setIsLoading(false);
                return;
            }
			
            // Il reste de la place, on peut continuer

			// If user is not logged in, sign in anonymously
            if (!user) {
                const { data, error } = await signInAnonymously();
                if (error || !data) {
                    logger.error('supabase:auth', 'StudentForm', 'Impossible to sign in anonymously', error);
                    setIsLoading(false);
                    setError('Impossible de se connecter. Veuillez réessayer plus tard.');
                    return;
                }
				revalidatePath("/", "layout");
				router.refresh();
			}

            if (!user) {
                logger.error('next:page', 'StudentForm', 'User not found after sign in anonymously');
                setIsLoading(false);
                setError('Impossible de se connecter. Veuillez réessayer plus tard.');
                return;
            }
			
            const firstName = formData.get('first-name') as string;
            const lastName = formData.get('last-name') as string;
            await createAttendance(firstName, lastName, roomCode, user.id);
            
            router.push(nextUrl);
			
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
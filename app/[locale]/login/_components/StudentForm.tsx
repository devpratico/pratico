'use client'
import * as Form from '@radix-ui/react-form';
import { TextField, Button, Flex, Box } from '@radix-ui/themes';
import { signInAnonymously, setNames } from '../_actions/actions';
import { useState } from 'react';
import logger from '@/app/_utils/logger';
import { useSearchParams, useRouter } from 'next/navigation';

export default function StudentForm() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const nextUrl = searchParams.get('nextUrl');
    const [isLoading, setIsLoading] = useState(false);

    return (
        <Form.Root onSubmit={async (event) => {
            event.preventDefault();
            setIsLoading(true);
            const formData = new FormData(event.currentTarget);
            const firstName = formData.get('first-name') as string;
            const lastName  = formData.get('last-name')  as string;

            try {
                const { user } = await signInAnonymously();
                if (!user) throw new Error('No user returned from sign in anonymously');
                await setNames({ id: user.id, first_name: firstName, last_name: lastName });

                if (nextUrl) {
                    router.push(nextUrl);
                } else {
                    logger.error('next:page', 'No nextUrl found in query params');
                    router.push('/room');
                }

            } catch (error) {
                logger.error('supabase:auth', 'Error signing in anonymously', (error as Error).message);
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

                <Box style={{alignSelf: 'flex-end'}}>
                    <Button type="submit" loading={isLoading}>OK</Button>
                </Box>
            </Flex>
        </Form.Root>
    )
}
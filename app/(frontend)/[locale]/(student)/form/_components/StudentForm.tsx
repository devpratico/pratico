'use client'
import * as Form from '@radix-ui/react-form';
import { TextField, Button, Flex, Text, Checkbox, Link, TextArea } from '@radix-ui/themes';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { janifera } from '@/app/(frontend)/Fonts';
import { submitAttendanceForm } from '@/app/(backend)/api/attendance/attendance.client';
import { useFormState, useFormStatus } from 'react-dom';


const cguLink = "https://www.pratico.live/conditions-generales-dutilisation-et-de-vente"

export default function StudentForm() {
    const searchParams = useSearchParams();
    const nextUrl = searchParams.get('nextUrl');
    const roomCode = nextUrl?.split('/').pop();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const fullName = `${firstName} ${lastName}`;

    const [state, action] = useFormState(submitAttendanceForm, { error: null });

    if (!nextUrl) throw new Error('nextUrl not found in query params');
    if (!roomCode) throw new Error('Room code not found in query params');

    return (
        <Form.Root action={action}>
            <Flex direction='column' gap='3'>

                <input type="hidden" name="room-code" value={roomCode} />
                <input type="hidden" name="next-url" value={nextUrl} />

                <Form.Field key='first-name' name='first-name'>
                    <Form.Control asChild>
                        <TextField.Root
                            placeholder='Prénom'
                            required
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                        />
                    </Form.Control>
                </Form.Field>

                <Form.Field key='last-name' name='last-name'>
                    <Form.Control asChild>
                        <TextField.Root
                            placeholder='Nom'
                            required
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                        />
                    </Form.Control>
                </Form.Field>

                <Form.Field key='additional-info' name='additional-info'>
                    <Form.Control asChild>
                        <TextArea placeholder='Informations supplémentaires (facultatif)'/>
                    </Form.Control>
                </Form.Field>


                <Form.Field key='accept-cgu' name='accept-cgu'>
                    <Text as="label">
                        <Flex gap='2' align={'center'}>
                            <Checkbox required/>
                            <Text as='span' size='1' trim='end'>
                                {"J'accepte les "}<Link href={cguLink} target="_blank">{"conditions générales d'utilisation"}</Link>
                            </Text>
                        </Flex>
                    </Text>
                </Form.Field>


				<Flex mt='5' justify='between' height='20px'>
					<Text mr='5' size='8' className={janifera.className}>{fullName}</Text>
					<SubmitButton/>
				</Flex>

                {state.error && (
                    <Text color="red">{state.error}</Text>
                )}

            </Flex>
        </Form.Root>
    )
}



function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <Button type="submit" disabled={pending}>
            {'Rejoindre la session'}
        </Button>
    )
}
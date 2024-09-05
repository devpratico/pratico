import React, { SetStateAction, useEffect, useState } from 'react';
import { Button, Flex, Tabs, TextField } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import * as Form from '@radix-ui/react-form';
import { Mail } from 'lucide-react';

export default function PasswordForgottenBtn({ clicked, onClick }:{ clicked: boolean, onClick: React.Dispatch<SetStateAction<boolean>>}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [successToast, setSuccessToast] = useState({show: false, msg: ''});
  
  const router = useRouter();
  let timeout: NodeJS.Timeout | null = null;

  const handleClick = async (event: React.FormEvent) => {
    event.preventDefault();
    onClick(true);
    try {
      if (timeout !== null) {
        clearTimeout(timeout);
      }
      await sendMessage(email);
      setSuccessToast({ show: true, msg: 'Votre problème va être résolu au plus vite !'});
      timeout = setTimeout(() => {
        setOpen(false);
        setEmail('');
        router.push('/');
      }, 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      setSuccessToast({ show: true, msg: "Quelque chose s'est mal passé, merci de nous contacter"});
      if (timeout !== null) {
        clearTimeout(timeout);
      }
    }
  };

  const sendMessage = async (name: string) => {
    const response = await fetch('/api/bot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error('Error sending message');
    }

    const data = await response.json();
    console.log(data.success ? 'Message sent successfully' : 'Error while sending msg');
  };

  return (
    <div>
      {!open && !clicked ? (
        <Button onClick={() => { onClick(true); setOpen(true)}}>Mot de passe oublié ?</Button>
      ) : (
          successToast.show
          ? <>
                {successToast.msg}
          </>
          : <>
                  <Form.Root>
                      <Flex direction='column' gap='5' pt='5'>

                          <Form.Field key='email' name='email'>
                              <Form.Control asChild>
                                  <TextField.Root placeholder={'email'} value={email} onChange={(e) => setEmail(e.target.value)}required>
                                      <TextField.Slot><Mail /></TextField.Slot>
                                  </TextField.Root>
                              </Form.Control>
                          </Form.Field>

                          {/* <Form.Field key='name' name='name'>
                              <Form.Control asChild>
                                  <TextField.Root placeholder={'prenom'}>
                                      <TextField.Slot><RectangleEllipsis /></TextField.Slot>
                                  </TextField.Root>
                              </Form.Control>
                          </Form.Field> */}

                          <Form.Submit asChild>
                              <Button onClick={handleClick}>
                                  Mot de passe oublié
                              </Button>
                          </Form.Submit>

                        </Flex>

                  </Form.Root>
          </>
      )}
    </div>
  );
}

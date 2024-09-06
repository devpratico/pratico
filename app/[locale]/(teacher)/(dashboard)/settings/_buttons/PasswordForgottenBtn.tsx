import React, { SetStateAction, useEffect, useState } from 'react';
import { Button, Flex, Link, TextField } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import * as Form from '@radix-ui/react-form';
import { Mail } from 'lucide-react';

export default function PasswordForgottenBtn({ clicked, onClick }:{ clicked: boolean, onClick: React.Dispatch<SetStateAction<boolean>>}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState<boolean | null>();
  const [successToast, setSuccessToast] = useState({show: false, msg: ''});
  
  const router = useRouter();
  let timeout: NodeJS.Timeout | null = null;

  const handleClick = async (event: React.FormEvent) => {
    event.preventDefault();
    setValidEmail(isValidEmail(email));
    onClick(true);
    if (validEmail)
    {
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
        }, 1000);
      } catch (error) {
        console.error('Error sending message:', error);
        setSuccessToast({ show: true, msg: "Quelque chose s'est mal passé, merci de nous contacter"});
        if (timeout !== null) {
          clearTimeout(timeout);
        }
      }
    }
    else
    {
      setSuccessToast({show: false, msg: 'Adresse mail non valide'});
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


  function isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  const EmailInvalid = () => {
    const msg = <>
      {successToast.msg}
    </>
  
    return (msg);
  };

  return (
    <div>
      {!open && !clicked ? (
        <Link onClick={() => { onClick(true); setOpen(true)}} style={{ cursor: 'pointer' }}>Mot de passe oublié ?</Link>
      ) : (
          successToast.show
          ? <>
                {successToast.msg}
          </>
          : <>
              <Flex direction='column' gap='5' pt='5'>

              <Form.Field key='email' name='email'>
                  <Form.Control asChild>
                      <TextField.Root placeholder={'email'}
                        value={email}
                        style={{color: validEmail === false ? '#CC0000' : undefined}}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (!isValidEmail(email))
                             setValidEmail(null);
                          else
                            setValidEmail(true);
                        }}
                        required>
                          <TextField.Slot><Mail /></TextField.Slot>
                      </TextField.Root>
                  </Form.Control>
              </Form.Field>
              {
                (validEmail === false)
                ? <EmailInvalid />
                : null
              }
              <Form.Submit asChild >
                  <Button onClick={handleClick}>
                      Envoyer
                  </Button>
              </Form.Submit>

            </Flex>

          </>
      )}
    </div>
  );
}

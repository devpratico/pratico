'use client';

import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogOverlay, DialogContent, DialogTitle, DialogDescription } from '@radix-ui/react-dialog';
import { Form, FormField, FormLabel, FormMessage, FormSubmit } from '@radix-ui/react-form';
import { Button } from '@radix-ui/themes';

export default function PasswordForgottenBtn() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await sendMessage(name);
      setOpen(false);
      setName('');
    } catch (error) {
      console.error('Sending msg error:', error);
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
      throw new Error('Sending msg error');
    }
  
    const data = await response.json();
    console.log(data.success ? 'Message sent successfully' : 'Error sending msg');
  } 

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Infos</Button>
        </DialogTrigger>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>Entrez votre nom</DialogTitle>
          <DialogDescription>
            Veuillez entrer votre nom :
          </DialogDescription>
          <Form onSubmit={handleSubmit}>
            <FormField name="name">
              <FormLabel htmlFor="name">Nom</FormLabel>
              <input id="name" type="text" value={name} onChange={(e: any) => setName(e.target.value)} required />
              <FormMessage>Entrer votre nom please.</FormMessage>
            </FormField>
            <FormSubmit asChild>
              <Button type='submit'>Envoyer</Button>
            </FormSubmit>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
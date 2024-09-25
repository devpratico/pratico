'use client';

import React, { useState } from 'react';
import { Button, TextField } from '@radix-ui/themes';

export default function PasswordForgottenBtn() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const handleClick = async (event: React.FormEvent) => {
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
    <div>
       { 
       		(!open)
			?
				<Button onClick={() => setOpen(true)}>Mot de passe oublié</Button>
			: 
			<>
				<TextField.Root placeholder='nom' value={name} onChange={(e) => setName(e.target.value)} required />
				<Button onClick={handleClick}>Envoyer</Button>
			</>
		}
    </div>
  );
};
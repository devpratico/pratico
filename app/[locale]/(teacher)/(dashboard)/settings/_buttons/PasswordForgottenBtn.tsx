import React, { useState } from 'react';
import { Resend } from 'resend';
import { Button } from '@radix-ui/themes';
import { EmailTemplate } from '../notifications/EmailTemplate';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export default function PasswordForgottenBtn() {
  const [message, setMessage] = useState('');

  const handleSendEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      const result = await fetch('/api/resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'lemaildejo@gmail.com',
          to: ['jcourtoi@student.42.fr'],
          subject: 'Email test',
          react: EmailTemplate({ name: "Johanna" })
        }),
      });

      const data = await result.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Error while sending message', error);
      setMessage('Error while sending msg.');
    }
  };

  return (
      <Button onClick={handleSendEmail}>Mot de passe oublié</Button>
  );
};
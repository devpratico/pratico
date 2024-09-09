"use client";

import React, { useState } from 'react';
import * as Form from '@radix-ui/react-form';
import { Button, Flex, TextField } from '@radix-ui/themes';
import createClient from '@/supabase/clients/client';
import { useRouter } from '@/app/_intl/intlNavigation';

export default function UpdatePassword() {
  const [newPassword, setNewPassword] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (data.user) {
        console.log('DATA PW:', data);
        alert('Mot de passe mis à jour avec succès!');
        router.push('/auth?authTab=login');
      } else {
        if (!data.user)
          alert('Vous ne pouvez pas reprendre un mot de passe déjà utilisé.')
        if (error)
          alert("Une erreur s'est produite lors de la mise à jour du mot de passe.");
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Flex direction='column' gap='2' pt='5'>
 
      <Form.Root onSubmit={handleSubmit}>

          <Form.Field name='password'>
              <TextField.Root
                  type='password' //showPassword ? password : text
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nouveau mot de passe">
              </TextField.Root>
          </Form.Field>
          <Button type="submit">Changer le mot de passe</Button>

      </Form.Root>

    </Flex>
  );
}

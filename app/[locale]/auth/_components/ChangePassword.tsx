import React, { useState } from 'react';
// import { useRouter } from '@/app/_intl/intlNavigation';
import * as Form from '@radix-ui/react-form';
import { Button, TextField } from '@radix-ui/themes';
import createClient from '@/supabase/clients/client';

function ChangerMotDePasse() {
  const [newPassword, setNewPassword] = useState('');
//   const router = useRouter();
  const supabase = createClient();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (data) {
        alert("Mot de passe mis à jour avec succès!");
        // router.push('/');
      } else if (error) {
        alert("Une erreur s'est produite lors de la mise à jour du mot de passe.");
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Form.Root onSubmit={handleSubmit}>
        <Form.Field name='password'>
            <TextField.Root
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nouveau mot de passe">
            </TextField.Root>
        </Form.Field>
        <Button type="submit">Changer le mot de passe</Button>
  </Form.Root>
  
  );
}

export default ChangerMotDePasse;

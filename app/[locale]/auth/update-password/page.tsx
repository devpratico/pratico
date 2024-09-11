"use client";

import React, { useEffect, useState } from 'react';
import * as Form from '@radix-ui/react-form';
import { Button, Flex, TextField } from '@radix-ui/themes';
import createClient from '@/supabase/clients/client';
import { useRouter } from '@/app/_intl/intlNavigation';
import { Eye, EyeOff } from 'lucide-react';
import { getUserByEmail } from '@/app/api/_actions/user';
import { User } from '@supabase/supabase-js';

type newPasswordType = {
	password: string,
	confirmedPassword: string,
	show: boolean
}

export default function UpdatePassword() {
  const [newPassword, setNewPassword] = useState<newPasswordType>({password: '', confirmedPassword: '', show: false});
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
	if (newPassword.password !== newPassword.confirmedPassword) {
		alert('Les mots de passe ne sont pas indentiques');
	} else {
		try {
			const { data, error } = await supabase.auth.updateUser({
				password: newPassword.password
			});
			if (!error)
			{
				alert(`Mot de passe mis à jour avec succès!`);
				router.push('/');
			}
			else {
				if (error.code === 'weak_password')
					alert("Votre mot de passe est trop faible, veuillez réessayer");
				else if (error.code === 'same_password')
					alert("Vous ne pouvez pas réutiliser un ancien mot de passe, veuillez réessayer");
				else
					alert("Quelque chose s'est mal passé, veuillez réessayer");
				console.error("error:", error.status, error.message, error.cause);
			}
		} catch (error) {
			alert("Quelque chose s'est mal passé, veuillez réessayer ultérieurement");
			console.error('Error:', error);
		}
	}
   
  };

  return (
    <Flex direction='column' gap='2' pt='5'>
 
		<Form.Root onSubmit={handleSubmit}>

			<Form.Field name='password'>
				<TextField.Root
					type={newPassword.show ? 'text' : 'password'}
					value={newPassword.password}
					onChange={(e) => setNewPassword({...newPassword, password: e.target.value})}
					placeholder="Nouveau mot de passe">
				</TextField.Root>
			</Form.Field>
			<Form.Field name='confirm-password'>
				<TextField.Root
					type={newPassword.show ? 'text' : 'password'}
					value={newPassword.confirmedPassword}
					onChange={(e) => setNewPassword({...newPassword, confirmedPassword: e.target.value})}
					placeholder="Confirmer le mot de passe">
				</TextField.Root>
			</Form.Field>
			<div>
			{
				newPassword.show
				? <Eye style={{cursor: 'pointer'}} onClick={() => setNewPassword({...newPassword, show: !newPassword.show})} /> 
				: <EyeOff style={{cursor: 'pointer'}} onClick={() => setNewPassword({...newPassword, show: !newPassword.show})}/>
			}
		  </div>
          <Button type="submit">Changer le mot de passe</Button>

      </Form.Root>

    </Flex>
  );
}

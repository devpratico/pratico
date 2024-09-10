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


//   useEffect(() => {
// 	supabase.auth.onAuthStateChange( async (event, session) => {
// 			console.log('event', event);
// 	})

//   }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
	if (newPassword.password !== newPassword.confirmedPassword) {
		alert('Les mots de passe ne sont pas indentiques');
	} else {
		try {
			supabase.auth.onAuthStateChange( async (event, session) => {
				console.log(event, session, "<-- event");
				const { data, error } = await supabase.auth.updateUser({
					password: newPassword.password
				});
				console.log('DATA', data);
				if (session?.user) {
					alert(`Mot de passe mis à jour avec succès!`);
					router.push('/auth?authTab=login');
				} else {
					// if (!data.user)
					// 	alert('Vous ne pouvez pas reprendre un mot de passe déjà utilisé.')
					if (error)
						alert("Une erreur s'est produite lors de la mise à jour du mot de passe.");
				}
			})
		} catch (error) {
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

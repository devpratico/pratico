"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@radix-ui/themes';

interface AuthErrorProps {
  errorDetails?: string;
}

export default function AuthCodeError({ errorDetails }: AuthErrorProps) {
  const router = useRouter();

  const handleRetry = () => {
    router.push('/auth/login');
  };

  return (
    <>
      Erreur d'authentification
	  {
	  	errorDetails
		? {errorDetails}
		: null
      }
      Une erreur s'est produite lors de la vérification du code.
      <Button onClick={handleRetry}>
        Réessayer
      </Button>
    </>
  );
}

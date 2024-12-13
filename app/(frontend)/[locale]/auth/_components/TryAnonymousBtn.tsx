'use client'
import { Button, ButtonProps } from '@radix-ui/themes';
import { ArrowRight } from 'lucide-react';
import { signInAnonymously, isUserAnonymous } from '@/app/(backend)/api/auth/auth.client';
import logger from '@/app/_utils/logger';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/app/(frontend)/_intl/intlNavigation';
import { useDisable } from '@/app/(frontend)/_hooks/contexts/useDisable';
import { useState } from 'react';
import Feedback from './Feedback';

export default function TryAnonymousBtn(props: ButtonProps) {
    const router = useRouter();
    const { disabled, setDisabled } = useDisable();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const nextUrl = searchParams.get('nextUrl');
    const [serverError, setServerError] = useState<string | null>(null);

    const handleClick = async () => {
        setServerError(null);
        setIsLoading(true);
        setDisabled(true);
        const isAnon = await isUserAnonymous();
        
        // If already logged in a anonymously, don't sign in again (otherwise it creates a new anon account)
        if (isAnon) {
            setIsLoading(false);
            setDisabled(false);
            router.push(nextUrl || '/capsules');

        } else {
            const { data, error } = await signInAnonymously();
            setIsLoading(false);
            setDisabled(false);

            if (error) {
                logger.error('supabase:auth', 'Error signing in anonymously', error);
                setServerError(error);

            } else {
                router.push(nextUrl || '/capsules');
            }
        }
    }

    return (
        <>
            <Button variant='soft' disabled={disabled} loading={isLoading} onClick={handleClick} {...props}>
                Essayer sans compte
                <ArrowRight />
            </Button>

            {serverError && <Feedback color='red' message={serverError} />}
        </>
    )
}
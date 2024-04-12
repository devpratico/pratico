'use client';
import styles from './AuthDialog.module.css';
import createClient from "@/supabase/clients/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Dialog, DialogContent } from '@/app/[locale]/_components/primitives/Dialog/Dialog'
//import loginImage from '@/public/illustrations/login.svg'
//import Image from 'next/image';
import { useUi } from '@/app/[locale]/_hooks/useUi';
import { useAuth } from '@/app/[locale]/_hooks/useAuth';
import { useState, useEffect } from 'react';
import PlainBtn from '@/app/[locale]/_components/primitives/buttons/PlainBtn/PlainBtn';


/**
 * The title of the dialog is passed as a prop because it is a client component;
 * client components can't use translations (see internationalisation guide in docs)
 */
interface AuthDialogProps {
    title: string;
}

export default function AuthDialog({ title }: AuthDialogProps) {
    const { authDialogOpen, setAuthDialogOpen } = useUi();
    const { user, isUserLoading } = useAuth();
    const [firstRender, setFirstRender] = useState(true);

    // Dialog opens on first render, after loading and if no user is logged in
    // TODO: Make a better system, a login page with route interception (Next.js)
    /*
    useEffect(() => {
        if (firstRender && !isUserLoading) {
            setFirstRender(false)
            setAuthDialogOpen(true)
        }
    }, [firstRender, isUserLoading, setAuthDialogOpen]);
    */

    // Dialog is never open if user is logged in (or if loading)
    useEffect(() => {
        if (user && !isUserLoading) {
            setAuthDialogOpen(false)
        }
    }, [user, isUserLoading, setAuthDialogOpen]);
    

    return (
        <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>

            <DialogContent showCloseBtn={false}>
                <div className={styles.container}>
                    <h1>{title}</h1>
                    <div className={styles.formContainer}>
                        <Auth
                            supabaseClient={createClient()}
                            providers={[]}
                            socialLayout='horizontal'
                            appearance={{
                                theme: ThemeSupa,
                                variables: {
                                    default: {
                                        colors: {
                                            brand: 'var(--primary)',
                                            brandAccent: 'var(--primary-border)',
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                    <PlainBtn
                        color="secondary"
                        size="m"
                        onClick={() => {
                            //setIsAnonymous(true)
                            setAuthDialogOpen(false)
                        }}
                        message="Skip"
                    />
                    {/*<Image src={loginImage} alt="Login" height={400} />*/}
                </div>

            </DialogContent>
        </Dialog>
    );
}
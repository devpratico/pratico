'use client';
import styles from './AuthDialog.module.css';
import { createClient } from "@/utils/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Dialog, DialogContent } from '@/components/primitives/Dialog/Dialog'
//import loginImage from '@/public/illustrations/login.svg'
//import Image from 'next/image';
import { useUi } from '@/contexts/UiContext';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export default function AuthDialog() {

    const { authDialogOpen: open, setAuthDialogOpen: setOpen } = useUi();
    const { user, isUserLoading } = useAuth();

    useEffect(() => {
        if (user || isUserLoading) {
            setOpen(false);
        } else {
            setOpen(true);
        }
    }, [user, isUserLoading, setOpen]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogContent closeBtn={true}>
                
                <div className={styles.formContainer}>
                    <Auth
                        supabaseClient={createClient()}
                        providers={[]}
                        socialLayout='horizontal'
                        redirectTo='/dashboard'
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

                {/*<Image src={loginImage} alt="Login" height={400} />*/}

            </DialogContent>
        </Dialog>
    );
}
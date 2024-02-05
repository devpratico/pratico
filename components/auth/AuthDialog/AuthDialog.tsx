'use client';
import styles from './AuthDialog.module.css';
import { useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Dialog, DialogContent, DialogTrigger } from '@/components/primitives/Dialog/Dialog'
//import loginImage from '@/public/illustrations/login.svg'
//import Image from 'next/image';

export default function AuthDialog() {

    // his terrible hack is to prevent a hydration error
    const [open, setOpen] = useState(false);
    useEffect(() => {
        setOpen(true);
    }, []);

    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogContent closeBtn={true}>
                
                <div className={styles.formContainer}>
                <Auth
                    supabaseClient={createClient()}
                    providers={[]}
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
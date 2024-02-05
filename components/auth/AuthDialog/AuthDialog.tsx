'use client';
import styles from './AuthDialog.module.css';
import { createClient } from "@/utils/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Dialog, DialogContent } from '@/components/primitives/Dialog/Dialog'
//import loginImage from '@/public/illustrations/login.svg'
//import Image from 'next/image';

export default function AuthDialog() {
    return (
        <Dialog open={true}>
            <DialogContent closeBtn={true}>
                
                <div className={styles.formContainer}>
                    <Auth
                    supabaseClient={createClient()}
                    providers={['apple', 'google', 'zoom']}
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
    
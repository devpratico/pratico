'use client'
import { Auth } from "@supabase/auth-ui-react";
import createClient from "@/supabase/clients/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import en from '@/app/_intl/messages/en.json'


export default function AuthUi({ messages }: { messages: typeof en.Login }) {

    return (
        <Auth
            supabaseClient={createClient()}
            view= 'sign_up'
            redirectTo={ window.location.origin + '/api/auth/callback' }
            providers={['google']}
            queryParams={{
                access_type: 'offline',
                prompt: 'consent',
            }}
            socialLayout='horizontal'
            localization={{variables: messages}}
            showLinks={true}
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
                style: {
                    input: {
                        fontFamily: 'inherit',
                        fontSize: '1rem',
                        backgroundColor: 'var(--background)',
                    },
                    button: {
                        fontFamily: 'inherit',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                    },
                    label: {
                        fontFamily: 'inherit',
                    },
                    message: {
                        fontFamily: 'inherit',
                    },
                }
            }}
        />
    )
}
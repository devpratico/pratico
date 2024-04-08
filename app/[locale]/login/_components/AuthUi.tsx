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
            redirectTo="http://localhost:3000/fr/capsules"
            providers={[]}
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
                        fontSize: '1rem',
                        backgroundColor: 'var(--background)',
                    },
                }
            }}
        />
    )
}
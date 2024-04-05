'use client'
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import createClient from "@/supabase/clients/client";
import PlainBtn from "@/app/_components/primitives/buttons/PlainBtn/PlainBtn";
import { useRouter } from "next/navigation";


export default function Page() {

    const router = useRouter();

    const mainStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100dvh',
        width: '100vw',
        backgroundColor: 'var(--secondary)',
    };

    const containerStyle: React.CSSProperties = {
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '1rem',
    };

    const formContainerStyle: React.CSSProperties = {
        backgroundColor: 'var(--background)',
        width: '100%',
        //maxWidth: '300px',
        padding: '2rem',
        borderRadius: '1rem',
        boxShadow: 'var(--small-shadow)',
    };

    const buttonRowStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '1rem',
        alignSelf: 'flex-end',
    };



    return (
        <main style={mainStyle}>
            <div style={containerStyle}>
                <h1>Se connecter</h1>
                <div style={formContainerStyle}>
                    <Auth
                        supabaseClient={createClient()}
                        redirectTo="http://localhost:3000/"
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
                <div style={buttonRowStyle}>
                    <PlainBtn
                        color="secondary"
                        size="m"
                        onClick={() => {
                            //setIsAnonymous(true)
                            //setAuthDialogOpen(false)
                        }}
                        message="Essayer sans compte"
                    />
                    <PlainBtn
                        color="primary"
                        size="m"
                        onClick={() => {
                            router.push('/capsules')
                        }}
                        message="OK"
                    />
                </div>
            </div>
        </main>
    );
}
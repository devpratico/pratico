import AuthForm from "./_components/AuthForm";
//import StudentForm from "../form/_components/StudentForm";
import { getTranslations } from 'next-intl/server';
import en from '@/app/_intl/messages/en.json';
import { Card, Box, Flex } from "@radix-ui/themes";
//import Image from "next/image";
//import loginImage from '@/public/illustrations/login.svg';
import { Container, Section } from "@radix-ui/themes";
import { Viewport } from "next";


export const viewport: Viewport = {
    maximumScale: 1,
    userScalable: false,
}


export default async function Login({searchParams}: {searchParams: { [key: string]: string | string[] | undefined}}) {

    //const nextUrl = searchParams.nextUrl as string;
    const t = await getTranslations("AuthForm");

    const messages: typeof en.AuthForm = {
        "sign in": t('sign in'),
        "log out": t('log out'),
        "sign up": t('sign up'),
        "email": t('email'),
        "password": t('password'),
        "confirm password": t('confirm password'),
        "forgot password": t('forgot password'),
        "sign in with Google": t('sign in with Google'),
        "sign in with Apple": t('sign in with Apple'),
        "passwords do not match": t('passwords do not match'),
        "try without an account": t('try without an account'),
    }


    return (
        <main style={{backgroundColor:'var(--accent-2)', height:'100dvh', overflow:'scroll'}}>
            <Container size='1' p='2'>
                <Section>
                    <Card size='5'>
                        <AuthForm messages={messages} />
                    </Card>
                </Section>
            </Container>
        </main>
    );
}
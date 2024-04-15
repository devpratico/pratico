import AuthForm from "./AuthForm";
import { getTranslations } from 'next-intl/server';
import en from '@/app/_intl/messages/en.json';
import { Card, Box, Flex } from "@radix-ui/themes";
import Image from "next/image";
import loginImage from '@/public/illustrations/login.svg';




export default async function Login() {

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
        <main style={{backgroundColor: 'var(--secondary)'}} >
            <Flex align='center' justify='center' gap={{initial: '0', md:'9'}}  direction={{initial:'column', md:'row'}} style={{height: '100dvh'}}>

                <Box width={{md:'400px', initial:'300px'}} height={{md:'400px', initial:'300px'}} display={{initial: 'none', sm:'block'}}  style={{position: 'relative'}}>
                    <Image src={loginImage} sizes='100px' fill style={{objectFit: 'contain'}} alt='log in' />
                </Box>


                {/* Tablet and desktop view */}
                <Box asChild width='400px' display={{initial: 'none', sm:'block'}} >
                    <Card size='5'>
                        <AuthForm messages={messages} />
                    </Card>
                </Box>


                {/* Mobile view */}
                <Box p='5'  width='100%' height='100dvh' display={{initial: 'block', sm:'none'}} style={{backgroundColor:'var(--background)'}}>
                    <Flex direction='column' height='100%' justify='between' >
                        <Box width='100%' height='40%'   style={{position: 'relative'}}>
                            <Image src={loginImage} sizes='100px' fill style={{objectFit: 'contain'}} alt='log in' />
                        </Box>
                        <AuthForm messages={messages} />
                    </Flex>
                </Box>

            </Flex>
        </main>
    );
}
'use server'
import AuthUi from "./_components/AuthUi"
import { getTranslations } from 'next-intl/server';
import en from '@/app/_intl/messages/en.json';
import { Card, Heading, Separator, Box, Flex } from "@radix-ui/themes";
import Image from "next/image";
import loginImage from '@/public/illustrations/login.svg';




export default async function Login() {

    const t = await getTranslations("Login");

    const messages: typeof en.Login = {
        sign_up: {
            email_label: t("sign_up.email_label"),
            password_label: t("sign_up.password_label"),
            email_input_placeholder: t("sign_up.email_input_placeholder"),
            password_input_placeholder: t("sign_up.password_input_placeholder"),
            button_label: t("sign_up.button_label"),
            loading_button_label: t("sign_up.loading_button_label"),
            socia_provider_text: t("sign_up.socia_provider_text"),
            link_text: t("sign_up.link_text"),
            confirmation_text: t("sign_up.confirmation_text"),
        },
        sign_in: {
            email_label: t("sign_in.email_label"),
            password_label: t("sign_in.password_label"),
            email_input_placeholder: t("sign_in.email_input_placeholder"),
            password_input_placeholder: t("sign_in.password_input_placeholder"),
            button_label: t("sign_in.button_label"),
            loading_button_label: t("sign_in.loading_button_label"),
            forgot_password: t("sign_in.forgot_password"),
            socia_provider_text: t("sign_in.socia_provider_text"),
            link_text: t("sign_in.link_text"),
        },
        forgotten_password: {
            email_label: t("forgotten_password.email_label"),
            password_label: t("forgotten_password.password_label"),
            email_input_placeholder: t("forgotten_password.email_input_placeholder"),
            button_label: t("forgotten_password.button_label"),
            loading_button_label: t("forgotten_password.loading_button_label"),
            link_text: t("forgotten_password.link_text"),
        }
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
                        <Heading as='h1' align='center' mb='4' >{t('sign_up.button_label')}</Heading>
                        <Separator orientation='horizontal' size='4'/>
                        <AuthUi messages={messages} />
                    </Card>
                </Box>


                {/* Mobile view */}
                <Box p='5'  width='100%' height='100dvh' display={{initial: 'block', sm:'none'}} style={{backgroundColor:'var(--background)'}}>
                    <Flex direction='column' height='100%' justify='between' >
                        <Heading as='h1' align='center' mb='4' >{t('sign_up.button_label')}</Heading>
                        <Box width='100%' height='40%'   style={{position: 'relative'}}>
                            <Image src={loginImage} sizes='100px' fill style={{objectFit: 'contain'}} alt='log in' />
                        </Box>
                        <AuthUi messages={messages} />
                    </Flex>
                </Box>




            </Flex>
        </main>
    );
}
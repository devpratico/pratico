import type { Metadata } from 'next'
import '@radix-ui/themes/styles.css';
import '../colors.css'
import '../globals.css'
//import AuthDialog from '@/components/auth/AuthDialog/AuthDialog'
import { UiProvider } from '@/app/[locale]/_hooks/useUi'
import { AuthProvider } from '@/app/[locale]/_hooks/useAuth'
import { getTranslations } from 'next-intl/server'
import { luciole } from '../Fonts'
import { Theme } from '@radix-ui/themes'
import AdminInfo from './_components/AdminInfo';


export const metadata: Metadata = {
    title: 'Pratico',
    description: '',
}

interface RootLayoutProps {
    children: React.ReactNode
    params: { locale: string }
}

export default async function RootLayout({children, params: { locale }}: RootLayoutProps) {

    const t = await getTranslations("auth")
    // TODO: Make a Ui provider for each page
    // TODO : get rid of that auth dialog and make an intercepting route
    
    return (
        <html lang={locale} data-theme="pratico">
            <AuthProvider>
                <UiProvider>

                    <body className={luciole.className}>
                        <Theme accentColor="violet">
                            {children}
                            <AdminInfo />
                        </Theme>
                    </body>

                    {/*<AuthDialog title={t('sign in')} />*/}
                </UiProvider>
            </AuthProvider>
        </html>
    )
}
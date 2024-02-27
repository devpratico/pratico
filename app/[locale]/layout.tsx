import type { Metadata } from 'next'
import '../colors.css'
import '../globals.css'
import AuthDialog from '@/components/auth/AuthDialog/AuthDialog'
import { UiProvider } from '@/hooks/UiContext'
import { AuthProvider } from '@/hooks/AuthContext'
import { getTranslations } from 'next-intl/server'
import { luciole } from '../Fonts'


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
    
    return (
        <html lang={locale} data-theme="pratico">
            <AuthProvider>
                <UiProvider>
                    <body className={luciole.className}>{children}</body>
                    <AuthDialog title={t('sign in')} />
                </UiProvider>
            </AuthProvider>
        </html>
    )
}
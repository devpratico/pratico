import type { Metadata } from 'next'
import localFont from 'next/font/local'
import '../colors.css'
import '../globals.css'
import AuthDialog from '@/components/auth/AuthDialog/AuthDialog'
import { UiProvider } from '@/contexts/UiContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { getTranslations } from 'next-intl/server'


const luciole = localFont({
    src: [
        {
            path: '../../public/fonts/Luciole-Regular.woff2',
            weight: 'normal',
            style: 'normal',
        },
        {
            path: '../../public/fonts/Luciole-Bold.woff2',
            weight: 'bold',
            style: 'normal',
        },
        {
            path: '../../public/fonts/Luciole-Italic.woff2',
            weight: 'normal',
            style: 'italic',
        },
        {
            path: '../../public/fonts/Luciole-BoldItalic.woff2',
            weight: 'bold',
            style: 'italic',
        },
    ],
})


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
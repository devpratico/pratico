import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './colors.css'
import './globals.css'
import AuthDialog from '@/components/auth/AuthDialog/AuthDialog'
import { UiProvider } from '@/contexts/UiContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { NextIntlClientProvider, useMessages } from 'next-intl'


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

export default function RootLayout({
    children,
    params: { locale },
}: {
    children: React.ReactNode
    params: { locale: string }
}) {

    const messages = useMessages()

    return (
        <AuthProvider>
            <UiProvider>
                <html lang={locale} data-theme="pratico">
                    <NextIntlClientProvider messages={messages}>
                        <body className={luciole.className}>{children}</body>
                        <AuthDialog/>
                    </NextIntlClientProvider>
                </html>
            </UiProvider>
        </AuthProvider>
    )
}
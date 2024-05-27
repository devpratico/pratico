import type { Metadata } from 'next'
import '@radix-ui/themes/styles.css';
import '../colors.css'
import '../globals.css'
import { luciole } from '../Fonts'
import { Theme } from '@radix-ui/themes'


export const metadata: Metadata = {
    title: 'Pratico',
    description: '',
}

interface RootLayoutProps {
    children: React.ReactNode
    params: { locale: string }
}

export default async function RootLayout({children, params: { locale }}: RootLayoutProps) {
    
    return (
        <html lang={locale} data-theme="pratico">
            <body className={luciole.className}>
                <Theme accentColor="violet">
                    {children}
                </Theme>
            </body>
        </html>
    )
}
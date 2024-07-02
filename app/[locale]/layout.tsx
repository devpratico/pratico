import type { Metadata } from 'next'
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes'
import '../colors.css'
import '../globals.css'
import { luciole } from '../Fonts'
import { DisableProvider } from './_hooks/useDisable';


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
                    <DisableProvider>
                        {children}
                    </DisableProvider>
                </Theme>
            </body>
        </html>
    )
}
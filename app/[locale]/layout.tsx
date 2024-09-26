import type { Metadata, Viewport } from 'next'
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes'
import '../colors.css'
import '../globals.css'
import { luciole } from '../Fonts'
import { DisableProvider } from '@/app/_hooks/useDisable';
import { AuthContextProvider } from '../_hooks/useAuth';
import createClient from '@/supabase/clients/server';


export const metadata: Metadata = {
    title: 'Pratico',
    description: '',
}

export const viewport: Viewport = {
    width: 'device-width',
    viewportFit: 'cover',
    themeColor: 'var(--accent-10)',
}

interface RootLayoutProps {
    children: React.ReactNode
    params: { locale: string }
}

export default async function RootLayout({children, params: { locale }}: RootLayoutProps) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser()
    
    return (
        <html lang={locale} data-theme="pratico">
            <body className={luciole.className}>
                <Theme accentColor="violet" appearance='light' panelBackground='solid'>
                    <DisableProvider>
                        <AuthContextProvider user={data?.user || undefined} >
                            {children}
                        </AuthContextProvider>
                    </DisableProvider>
                </Theme>
            </body>
        </html>
    )
}
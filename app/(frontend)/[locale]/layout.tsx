import type { Metadata, Viewport } from 'next'
import { Theme } from '@radix-ui/themes'
import '../colors.css'
import '../globals.css'
import '@radix-ui/themes/styles.css';
import { luciole } from '../Fonts'
import { DisableProvider } from '@/app/(frontend)/_hooks/contexts/useDisable';
import { UserContextProvider } from '@/app/(frontend)/_hooks/contexts/useUser';
import createClient from '@/supabase/clients/server';
import { customerIsSubscribed } from '@/app/(backend)/api/stripe/stripe.server';
import { NextIntlClientProvider } from 'next-intl';
import FocusZoneProvider from '../_hooks/useFocusZone';


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
    let firstName: string | undefined
    let lastName: string | undefined

    if (data.user) {
        const { data: names, error: namesError } = await supabase.from('user_profiles').select('first_name, last_name').eq('id', data.user.id).single()
        if (!namesError) {
            firstName = names?.first_name || undefined
            lastName = names?.last_name || undefined
        }
    }

    const isSubscribed = await customerIsSubscribed(data?.user?.id)
    
    return (
        <html lang={locale} data-theme="pratico">
            <body className={luciole.className}>
                <Theme accentColor="violet" appearance='light' panelBackground='translucent' grayColor='mauve'>
                    <DisableProvider>
                        <UserContextProvider user={data?.user || undefined} firstName={firstName} lastName={lastName} isSubscribed={isSubscribed}>
							<NextIntlClientProvider>
						 	   {children}
							</NextIntlClientProvider>
                        </UserContextProvider>
                    </DisableProvider>
                </Theme>
            </body>
        </html>
    )
}
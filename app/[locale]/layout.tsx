import type { Metadata } from 'next'
import '@radix-ui/themes/styles.css';
import '../colors.css'
import '../globals.css'
import { UserProvider } from './_hooks/useUser';
import { luciole } from '../Fonts'
import { Theme } from '@radix-ui/themes'
import AdminInfo from './_components/AdminInfo';
import { fetchUser } from '@/supabase/services/auth';
import { User } from '@supabase/supabase-js';


export const metadata: Metadata = {
    title: 'Pratico',
    description: '',
}

interface RootLayoutProps {
    children: React.ReactNode
    params: { locale: string }
}

export default async function RootLayout({children, params: { locale }}: RootLayoutProps) {

    //const user = await fetchUser()
    let user: User | undefined = undefined
    try {
        user = await fetchUser()
    } catch (error) {
        //console.error(error)
    }
    
    return (
        <html lang={locale} data-theme="pratico">
            <UserProvider user={user}>
                <body className={luciole.className}>
                    <Theme accentColor="violet">
                        {children}
                        <AdminInfo />
                    </Theme>
                </body>
            </UserProvider>
        </html>
    )
}
import type { Metadata } from 'next'
import '@radix-ui/themes/styles.css';
import '../colors.css'
import '../globals.css'
import { UserProvider } from './_hooks/useUser';
import { luciole } from '../Fonts'
import { Theme } from '@radix-ui/themes'
import { fetchUser, User, fetchNames, Names } from './_actions/user'
import { HintsProvider } from './_hooks/useHints';


export const metadata: Metadata = {
    title: 'Pratico',
    description: '',
}

interface RootLayoutProps {
    children: React.ReactNode
    params: { locale: string }
}

export default async function RootLayout({children, params: { locale }}: RootLayoutProps) {

    let user: User | undefined
    let names: Names | undefined

    try {
        user = await fetchUser()
    } catch (error) {
        user = undefined
    }

    try {
        if (user) names = await fetchNames(user.id)
    } catch (error) {
        names = undefined
    }
    
    return (
        <html lang={locale} data-theme="pratico">
            <body className={luciole.className}>
                <UserProvider user={user} firstName={names?.first_name || null} lastName={names?.last_name || null}>
                    <Theme accentColor="violet">
                        <HintsProvider>
                            {children}
                        </HintsProvider>
                    </Theme>
                </UserProvider>
            </body>
        </html>
    )
}
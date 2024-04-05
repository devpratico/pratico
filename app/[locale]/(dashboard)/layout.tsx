import DashboardLeftBar from './_components/LeftBar'
import MenuBar from './_components/MenuBar'
import { getTranslations } from 'next-intl/server'
import { ScrollArea, Flex, Grid, Box } from '@radix-ui/themes'


interface RootLayoutProps {
    params: any;
    children: React.ReactNode
}

export default async function DashboardLayout({children }: RootLayoutProps) {

    const t = await getTranslations("dashboard")
    // TODO: Is there a better way to do this ?
    const leftbarMessages = {
        'capsules': t('capsules'),
        'activities': t('activities'),
        'quizes and surveys': t('quizes and surveys'),
        'reports': t('reports'),
        'help': t('help'),
        'settings': t('settings'),
    }

    /*
    return (
        <div style={containerStyle}>
            <MenuBar style={{gridArea: 'menuBar'}}/>
            <DashboardLeftBar messages={leftbarMessages} style={{gridArea: 'leftBar'}}/>
            <main>
                {children}
            </main>
        </div>
    )*/

    /*
    <DashboardLeftBar messages={leftbarMessages}/>
                <ScrollArea>
                    {children}
                </ScrollArea>
                */

    return (
        <Grid rows='auto 1fr' style={{height: '100dvh'}}>
            <MenuBar/>

            <Grid columns='auto 1fr' height='100%'>
                <DashboardLeftBar messages={leftbarMessages}/>
                <ScrollArea type="always" scrollbars="vertical" style={{ height: '100%' }}>
                    {children}
                </ScrollArea>
            </Grid>

        </Grid>
    )
}

const containerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gridTemplateRows: 'auto 1fr',
    gridTemplateAreas: `
        "menuBar menuBar"
        "leftBar content"
    `,
    height: '100dvh',
    width: '100vw',
}
import { Grid, Box } from "@radix-ui/themes"
import { CSSProperties } from "react"


export default function Layout({children }: { children: React.ReactNode }) {
    // gap='3' p='3'
    return (
        <Grid rows='auto 1fr' style={{height: '100dvh', backgroundColor:'var(--accent-2)'}}>
            {children}
        </Grid>
    )
}

export function TopBarBox({ children }: { children: React.ReactNode }) {
    return (
        <Box p='3' style={{
            backgroundColor: 'var(--accent-10)',
            color:           'var(--accent-contrast)',
            //borderRadius:    'var(--radius-3)',
            boxShadow:       'var(--shadow-2)',
            zIndex:          '1'
        }}>
            {children}
        </Box>
    )
}

/*
export function SideBarBox({ children }: { children: React.ReactNode }) {
    return (
        <Box gridColumnStart='1' gridColumnEnd='2' gridRowStart='2' gridRowEnd='3' style={{ zIndex: '1' }}>
            {children}
        </Box>
    )
}
    */

/*
export function ContentBox({ children, position='normal' }: { children: React.ReactNode, position?: 'normal' | 'full' }) {

    const normalPosition = { gridColumnStart: '2', gridColumnEnd: '3', gridRowStart: '2', gridRowEnd: '3'}
    const fullStyle: CSSProperties = { position: 'fixed', inset: 0}

    return (
        <Box {...(position == 'normal' ? normalPosition : {})} style={{zIndex:'0', ...(position == 'full' ? fullStyle : {})}}>
            {children}
        </Box>
    )
}
*/

/*
export function MenuBox({ children }: { children: React.ReactNode }) {
    return (
        <Box gridColumnStart='3' gridColumnEnd='4' gridRowStart='2' gridRowEnd='3' style={{zIndex:'1'}}>
            {children}
        </Box>
    )
}

export function FooterBox({ children }: { children: React.ReactNode }) {
    return (
        <Box gridColumnStart='1' gridColumnEnd='4' gridRowStart='3' gridRowEnd='4' style={{ zIndex: '1' }}>
            {children}
        </Box>
    )
}
*/
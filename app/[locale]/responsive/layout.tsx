import { Grid, Box, BoxProps } from "@radix-ui/themes"


export default function Layout({children }: { children: React.ReactNode }) {
    return (
        <Grid rows={{initial: '1fr auto', xs: 'auto 1fr'}} style={{height: '100dvh', backgroundColor:'var(--accent-2)'}}>
            {children}
        </Grid>
    )
}

export function TopBarBox({ children, ...props }: { children?: React.ReactNode } & BoxProps) {
    return (
        <Box
            id='top-bar-box'
            pl='calc(12px + env(safe-area-inset-left))'
            pr='calc(12px + env(safe-area-inset-right))'
            gridRow={{initial: '2', xs: '1'}}
            style={{
                backgroundColor: 'var(--accent-10)',
                color:           'var(--accent-contrast)',
                boxShadow:       'var(--shadow-3)',
                position:        'relative',
                zIndex:          '3'
            }}
            {...props}
        >
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
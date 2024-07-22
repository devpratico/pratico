import { Grid, Box, BoxProps } from "@radix-ui/themes"


export default function Layout({children }: { children: React.ReactNode }) {
    return (
        <Grid rows={{initial: '1fr auto', xs: 'auto 1fr'}} style={{height: '100dvh', backgroundColor:'var(--accent-2)'}}>
            {children}
        </Grid>
    )
}

/**
 * Use this in children of this layout to position the top bar.
 */
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
            }}
            {...props}
        >
            {children}
        </Box>
    )
}
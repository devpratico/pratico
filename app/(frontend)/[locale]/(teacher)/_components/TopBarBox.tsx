import { Box, BoxProps } from "@radix-ui/themes"


/**
 * Use this in children of this layout to position the top bar in the grid defined above.
 */
export default function TopBarBox({ children, ...props }: { children?: React.ReactNode } & BoxProps) {
    return (
        <Box
            id='top-bar-box'
            pl='calc(12px + env(safe-area-inset-left))'
            pr='calc(12px + env(safe-area-inset-right))'
            gridRow={{ initial: '2', xs: '1' }}
            style={{
                backgroundColor: 'var(--accent-10)',
                color: 'var(--accent-contrast)',
                boxShadow: 'var(--shadow-3)',
                position: 'relative',
                zIndex: '2',
            }}
            {...props}
        >
            {children}
        </Box>
    )
}
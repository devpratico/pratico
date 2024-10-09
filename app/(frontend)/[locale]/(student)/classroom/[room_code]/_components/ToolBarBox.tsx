import { Flex } from "@radix-ui/themes"


/**
 * Helps position the toolbar in the correct grid cell
 * For some reason, Next won't let me export it from the Layout file
 */
export default function ToolBarBox({ children, fakeProp = 'fake' }: { children: React.ReactNode, fakeProp?: string }) {
    return (
        <Flex gridRow={{ initial: '2', xs: '1' }} align='center'>
            {children}
        </Flex>
    )
}
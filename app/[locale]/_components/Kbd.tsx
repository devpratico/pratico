import { Text } from "@radix-ui/themes"


const Symbols = {
    enter: '⏎',
    shift: '⇧',
    ctrl: '⌃',
    alt: '⌥',
    meta: '⌘',
    delete: '⌫',
    escape: 'esc',
}

export default function Kbd({ k }: { k: keyof typeof Symbols }) {
    return (
        <Text size='2' style={{ opacity: '0.6' }}>
            {Symbols[k]}
        </Text>
    )
  
}